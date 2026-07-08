// Central place for "who can do what" in the admin panel.
// Matches the roles defined in the backend User model.

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  HOSPITAL_ADMIN: 'hospital_admin',
  BRANCH_MANAGER: 'branch_manager',
  CONTENT_EDITOR: 'content_editor',
  RECEPTION_OFFICER: 'reception_officer',
  MARKETING_OFFICER: 'marketing_officer',
}

// Can open the Web Editor page at all. Reception has no need for it,
// so it's hidden from their sidebar and the route itself is blocked.
export const canAccessContent = (role) =>
  [ROLES.SUPER_ADMIN, ROLES.CONTENT_EDITOR].includes(role)

// Can change website text/pages in the Web Editor.
export const canEditContent = (role) =>
  [ROLES.SUPER_ADMIN, ROLES.CONTENT_EDITOR].includes(role)

// Can book/manage appointment status.
export const canEditAppointments = (role) =>
  [ROLES.SUPER_ADMIN, ROLES.RECEPTION_OFFICER].includes(role)

// Can add/edit/delete Doctors, Services, and Branches — reserved for
// the super admin; everyone else can view these but not change them.
export const canEditManagement = (role) => role === ROLES.SUPER_ADMIN

export default {
  ROLES,
  canAccessContent,
  canEditContent,
  canEditAppointments,
  canEditManagement,
}
