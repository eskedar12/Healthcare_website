# Lebeza Psychiatry — Healthcare CMS

## Project description

A healthcare content management system for Lebeza Psychiatry Consultation, made up of three apps that share one MySQL database via a single backend API:

- **`backend/`** — Node.js + Express + Sequelize (MySQL) REST API. Handles auth, doctors, services, branches, appointments, page content, and contact form submissions (with email notifications).
- **`frontend/`** — the public website patients see (React + Vite + Tailwind). Displays doctors, services, and clinic info, and lets patients book appointments and send inquiries.
- **`admin/`** — the internal admin panel (React + Vite + Tailwind) staff use to manage appointments, doctors, services, branches, and edit the public site's text through the Web Editor.

```
Healthcare Website/
├─ backend/     ← API + database layer, runs on :5000
├─ frontend/    ← public site, runs on :5173 (or next free port)
└─ admin/       ← admin panel, runs on its own Vite port
```

---

## Installation steps

You need **Node.js 18+** and a running **MySQL** server installed first.

Install dependencies for each app separately:

```bash
cd backend
npm install

cd ../frontend
npm install

cd ../admin
npm install
```

---

## Environment variable setup

Only the **backend** needs a `.env` file — the frontend and admin apps read the backend's URL from their own optional `.env` (see below), but don't need secrets.

Create `backend/.env`:

```dotenv
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=healthcare
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# URLs
CLIENT_URL=http://localhost:3000
API_BASE_URL=http://localhost:5000/api

# Admin Seeder (Super Admin account)
ADMIN_EMAIL=admin@healthcare.com
ADMIN_PASSWORD=Admin@123
ADMIN_FULL_NAME=Super Admin

# Email (Gmail) — sends a notification whenever the Contact Us form is submitted
# EMAIL_PASS must be a Gmail "App Password" (not your normal password) —
# create one at https://myaccount.google.com/apppasswords (requires 2-Step Verification)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password
CONTACT_EMAIL_TO=your_email@gmail.com

# Reception Officer account (created via `npm run seed:roles`)
RECEPTION_EMAIL=reception@lebeza.com
RECEPTION_PASSWORD=Reception@123
RECEPTION_FULL_NAME=Reception Officer

# Content Editor account (created via `npm run seed:roles`)
CONTENT_EDITOR_EMAIL=editor@lebeza.com
CONTENT_EDITOR_PASSWORD=Editor@123
CONTENT_EDITOR_FULL_NAME=Content Editor
```

**Frontend / Admin (optional):** both default to `http://localhost:5000/api`. Only add a `.env` if your backend runs somewhere else:
```dotenv
VITE_API_BASE_URL=http://localhost:5000/api
```
The admin's Web Editor preview also has an optional override for where the public site is running:
```dotenv
VITE_SITE_URL=http://localhost:5173
```

---

## Database setup instructions

1. Make sure MySQL is running locally.
2. Create the database (name must match `DB_NAME` in `.env`):
   ```sql
   CREATE DATABASE healthcare;
   ```
3. From `backend/`, sync the tables. The server does this automatically on startup (see next section), but you can also run it manually:
   ```bash
   npm run sync
   ```
4. Seed the default accounts:
   ```bash
   npm run seed         # creates the Super Admin
   npm run seed:roles   # creates Reception and Content Editor accounts
   ```
   Both are safe to re-run — they skip accounts that already exist.

---

## How to run the backend

```bash
cd backend
npm run dev
```

Starts on **http://localhost:5000** with auto-restart on file changes (`nodemon`). On startup it connects to MySQL and auto-syncs the schema — watch the console for:

```
✅ Database connection established.
✅ Models synchronized.
🚀 Server running on http://localhost:5000
```

If you see `ERR_CONNECTION_REFUSED` from the frontend or admin apps, this server isn't running — start it first.

Use `npm start` instead of `npm run dev` for a plain run without auto-restart (e.g. in production).

---

## How to run the frontend

**Public website:**
```bash
cd frontend
npm run dev
```
Runs at **http://localhost:5173**.

**Admin panel:**
```bash
cd admin
npm run dev
```
Runs on its own Vite port (check the terminal output — Vite picks the next free port after 5173, e.g. 5174). Log in at `/admin/login`.

Both require the backend running first — most pages will look empty or show connection errors otherwise.

---

## Default login credentials

Created by the seed scripts above (`npm run seed` and `npm run seed:roles` in `backend/`). **Change these in `.env` before seeding if you don't want the defaults, and change the passwords after first login either way.**

| Role | Email | Password | What they can do |
|---|---|---|---|
| Super Admin | `admin@healthcare.com` | `Admin@123` | Full access to everything |
| Reception Officer | `reception@lebeza.com` | `Reception@123` | Book/manage appointments; view (but not edit) Doctors, Services, Branches; no access to the Web Editor |
| Content Editor | `editor@lebeza.com` | `Editor@123` | Edit the public site's text via the Web Editor; view (but not edit) everything else |

Log in at `admin/login` on whichever port the admin app is running on.
