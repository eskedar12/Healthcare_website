# Lebeza Healthcare CMS — Backend Documentation

This covers the three core folders of the backend: `src/models`, `src/controllers`, and `src/routes`.

**How the backend is layered:**

```
Route  →  Middleware (auth / role / validation)  →  Controller  →  Service (business logic)  →  Model (database)
```

- **Routes** define the URL, HTTP method, and which middleware/controller handles it.
- **Controllers** parse the request, call a service (or the model directly for simpler resources), and shape the response.
- **Models** define the database tables (Sequelize/MySQL) and their relationships.

---

## 1. Models (`src/models`)

Each file defines one Sequelize model = one MySQL table. All tables use `snake_case` columns and automatic `created_at`/`updated_at` timestamps.

### `User.js` — table `users`
Admin panel accounts (not patients).

| Field | Type | Notes |
|---|---|---|
| full_name | string | |
| email | string | unique |
| phone_number | string | optional |
| password | string | hashed |
| role | enum | `super_admin`, `hospital_admin`, `branch_manager`, `content_editor`, `reception_officer`, `marketing_officer` |
| branch_id | integer | optional, FK → branches |
| is_active | boolean | default `true` |

### `Doctor.js` — table `doctors`
Public-facing doctor profiles.

| Field | Notes |
|---|---|
| name, title, specialty | required |
| department | defaults to `Psychiatry` |
| email, phone | required |
| bio, education, languages | optional text |
| branches | JSON array of branch names the doctor works at |
| is_active | boolean |

Association: `Doctor.hasMany(Appointment)`

### `Branch.js` — table `branches`
Clinic locations.

| Field | Notes |
|---|---|
| name, address, phone | required |
| working_hours | JSON |
| is_active | boolean |

Associations: `Branch.hasMany(Doctor)`, `Branch.hasMany(User, as: 'users')`

### `Service.js` — table `services`
Services offered (e.g. "Psychiatric Consultation").

| Field | Notes |
|---|---|
| code | unique short code |
| name, duration, price | required |
| status | enum `Active` / `Inactive` |

### `Appointment.js` — table `appointments`
Bookings made via the public site or the admin "Book Only" form.

| Field | Notes |
|---|---|
| appointment_id | unique human-readable reference |
| patient_name, phone | required |
| doctor_id / doctor_name | either or both, FK → doctors |
| branch | branch name (string, not FK) |
| date, time | required |
| status | enum `Pending`, `Confirmed`, `Checked In`, `Cancelled` |
| notes | optional |

Associations: belongs to `Doctor`, `User` (creator), `Patient`.

### `Patient.js` — table `patients`
Optional patient records (not currently created by any route — reserved for future use).

| Field | Notes |
|---|---|
| first_name, last_name, phone | required |
| email, date_of_birth, gender, address, emergency_contact | optional |

Association: `Patient.hasMany(Appointment)`

### `Content.js` — table `content`
Backs the admin **Web Editor**. Each row is one editable "section" of one "page" (e.g. page=`home`, section=`hero`).

| Field | Notes |
|---|---|
| page | e.g. `home`, `about`, `contact`, `services`, `projects` |
| section | e.g. `hero`, `header`, `mission` |
| content | JSON — the actual editable fields |
| version, is_published, published_at | metadata, not currently surfaced in the UI |

Unique index on `(page, section)` — each section only has one live version. Belongs to `User` (who last edited it).

### `ContactMessage.js` — table `contact_messages`
Stores every "Contact us" form submission (see Inquiry docs below — this is its underlying table).

| Field | Notes |
|---|---|
| name, email, message | required |
| phone, subject | optional |
| status | enum `New`, `Read`, `Replied` |

### `Project.js` — table `projects`
Items shown on the public Projects page.

| Field | Notes |
|---|---|
| name | required |
| description, year | optional |
| is_featured, is_active | boolean |
| sort_order | integer |

### `Partner.js` — table `partners`
Logos shown in the "Trusted by" / partners section.

| Field | Notes |
|---|---|
| name | required |
| subtitle, logo_url, website | optional |
| sort_order, is_active | |

### `index.js`
Initializes every model with the shared Sequelize connection, then calls each model's `.associate()` to wire up relationships. Everything else in the backend imports models from here, e.g.:
```js
import { Doctor, Appointment } from '../models/index.js'
```

---

## 2. Controllers (`src/controllers`)

Controllers handle the request/response cycle. Most delegate business logic to a matching file in `src/services`; a few (Doctor, Content, Dashboard) talk to the model directly since their logic is simple.

### `authController.js`
| Function | Route | Purpose |
|---|---|---|
| `register` | `POST /auth/register` | Admin-only: create a new staff account |
| `login` | `POST /auth/login` | Verify credentials, return JWT + refresh token |
| `refreshToken` | `POST /auth/refresh-token` | Exchange a refresh token for a new access token |
| `getMe` | `GET /auth/me` | Return the logged-in user's profile |
| `logout` | `POST /auth/logout` | Stateless logout (no server-side session to invalidate yet) |

### `userController.js`
Full CRUD for staff accounts (`getUsers`, `getUser`, `createUser`, `updateUser`, `deleteUser`, `deactivateUser`, `activateUser`). Used for managing admin/reception/content-editor accounts.

### `doctorController.js`
CRUD for doctor profiles (`getAllDoctors`, `getDoctorById`, `createDoctor`, `updateDoctor`, `deleteDoctor`). Validates required fields and rejects duplicate emails directly in the controller (no separate service layer for this resource).

### `branchController.js`
CRUD for clinic branches, plus `getBranchStats` (appointment counts for that branch). Delegates to `services/branchService.js`.

### `serviceController.js`
CRUD for the Services catalog. Delegates to `services/serviceService.js`.

### `appointmentController.js`
The most involved controller — handles both the public booking form and admin appointment management.

| Function | Purpose |
|---|---|
| `createAppointment` | Normalizes multiple possible field names from different forms (`patient_name`/`patientName`, `doctor_id`/`doctorId`/plain doctor name, etc.) into one shape before saving. Also records the submitter's IP. |
| `getAppointments` | List with filters (status, doctor, branch, date range) |
| `getAppointment` / `getAppointmentByReference` | Look up one appointment by DB id or by its public reference code |
| `updateAppointment` | Edit appointment details |
| `updateAppointmentStatus` | Change status (Pending → Confirmed → Checked In → Cancelled); records which staff member (`assigned_to`) made the change |
| `cancelAppointment` | Soft-cancels an appointment |
| `getCalendar` | Data shaped for a calendar view |
| `getStats` | Appointment counts/breakdowns |

### `contentController.js`
Backs the Web Editor.

| Function | Purpose |
|---|---|
| `getPageContent` | Returns all sections for a page as `{ sectionName: content }`. If nothing has been saved yet **and** the page is `home`, returns hardcoded defaults so the site isn't empty on first load. |
| `updatePageContent` | Accepts `{ sectionName: content, ... }`, upserts each section as its own `Content` row, stamps `created_by`/`published_at`, then returns the refreshed page. |

### `dashboardController.js`
One function, `getDashboardStats` — runs several counts in parallel (today's appointments, distinct patients by phone number, active doctors, branch count, pending appointments) for the admin dashboard cards.

### `inquiryController.js`
Backs the public **Contact us** form.

| Function | Purpose |
|---|---|
| `createInquiry` | Saves the message to `ContactMessage`, then emails the clinic (via `services/mailService.js`) with the details. If the email fails to send, the submission still succeeds — the error is only logged. |
| `getInquiries` | Admin: list all submitted messages, newest first |
| `updateInquiryStatus` | Admin: mark a message `New` / `Read` / `Replied` |

---

## 3. Routes (`src/routes`)

Every route file exports an Express router; `routes/index.js` mounts them all under `/api`. Two kinds of protection are layered on top of routes:
- **`authenticate`** — must send a valid JWT (logged in)
- **`checkRole(...)`** — must be logged in *and* have one of the listed roles

### `index.js` (the mount point)
```
/api/auth          → authRoutes        (public + protected mix)
/api/inquiries      → inquiryRoutes     (public POST, protected GET/PUT)
/api/departments    → inline handler    (public, static list)
/api/users          → userRoutes        (protected)
/api/appointments   → appointmentRoutes (public POST, protected everything else)
/api/branches       → branchRoutes      (public GET, protected write)
/api/doctors        → doctorRoutes      (public GET, protected write)
/api/services       → serviceRoutes     (public GET, protected write)
/api/content        → contentRoutes     (public GET, protected write)
/api/dashboard      → dashboardRoutes   (protected)
/api/health         → inline handler    (public health check)
```

### `authRoutes.js`
| Method & Path | Access | Notes |
|---|---|---|
| POST `/login` | Public | |
| POST `/refresh-token` | Public | |
| GET `/me` | Authenticated | |
| POST `/logout` | Authenticated | |
| POST `/register` | `super_admin`, `hospital_admin` | Creates new staff accounts |

### `userRoutes.js`
All routes require `authenticate`.
| Method & Path | Access |
|---|---|
| GET `/` | `super_admin`, `hospital_admin` |
| POST `/` | `super_admin`, `hospital_admin` |
| GET `/:id` | Any authenticated user |
| PUT `/:id` | Any authenticated user |
| DELETE `/:id` | `super_admin`, `hospital_admin` |
| PATCH `/:id/deactivate` | `super_admin`, `hospital_admin` |
| PATCH `/:id/activate` | `super_admin`, `hospital_admin` |

### `doctorRoutes.js`
| Method & Path | Access |
|---|---|
| GET `/` , GET `/:id` | Public |
| POST `/`, PUT `/:id`, DELETE `/:id` | `super_admin`, `hospital_admin` |

### `serviceRoutes.js`
Same pattern as doctors — public reads, `super_admin`/`hospital_admin` writes.

### `branchRoutes.js`
| Method & Path | Access |
|---|---|
| GET `/`, GET `/:id` | Public |
| GET `/:id/stats` | Authenticated |
| POST `/`, PUT `/:id`, DELETE `/:id` | `super_admin`, `hospital_admin` |

> Note: the admin frontend currently restricts Doctor/Service/Branch editing to `super_admin` only (see the admin's own `utils/permissions.js`), even though the backend would technically also allow `hospital_admin`. That's a frontend-level policy layered on top of what the API permits.

### `appointmentRoutes.js`
| Method & Path | Access |
|---|---|
| POST `/` | Public — this is what the public booking form hits |
| GET `/reference/:ref` | Public — look up a booking by its reference code |
| GET `/`, GET `/calendar`, GET `/stats`, GET `/:id` | Authenticated (any role) |
| PUT `/:id`, PATCH `/:id/status`, DELETE `/:id` | Authenticated (any role) |

> Note: the backend allows any authenticated role to manage appointments; the admin frontend further restricts this to `super_admin`/`reception_officer` only.

### `contentRoutes.js`
| Method & Path | Access |
|---|---|
| GET `/:page` | Public — this is what every public page fetches its text from |
| POST `/:page` | `super_admin`, `hospital_admin`, `content_editor` |

### `dashboardRoutes.js`
| Method & Path | Access |
|---|---|
| GET `/stats` | Authenticated (any role) |

### `inquiryRoutes.js`
| Method & Path | Access |
|---|---|
| POST `/` | Public — the Contact page form |
| GET `/`, PUT `/:id` | `super_admin`, `hospital_admin` |

---

## Roles reference

Defined in `middleware/roleCheck.js`, matching the `role` enum on the `User` model:

| Role | Typical use |
|---|---|
| `super_admin` | Full access to everything |
| `hospital_admin` | Same backend permissions as super_admin on most routes |
| `branch_manager` | Defined but not currently wired to any special route behavior |
| `content_editor` | Web Editor access (frontend-enforced; see note under `contentRoutes.js`) |
| `reception_officer` | Appointment booking/management (frontend-enforced) |
| `marketing_officer` | Defined but not currently wired to any special route behavior |
