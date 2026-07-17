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

export const PERMISSIONS = {
  MANAGE_DOCTORS: 'manage_doctors',
  VIEW_DOCTORS: 'view_doctors',
  MANAGE_SERVICES: 'manage_services',
  VIEW_SERVICES: 'view_services',
  MANAGE_BRANCHES: 'manage_branches',
  VIEW_BRANCHES: 'view_branches',
  MANAGE_APPOINTMENTS: 'manage_appointments',
  VIEW_APPOINTMENTS: 'view_appointments',
  MANAGE_CONTENT: 'manage_content',
  VIEW_CONTENT: 'view_content',
  MANAGE_STAFF: 'manage_staff',
  VIEW_CONTACT_MESSAGES: 'view_contact_messages',
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_NOTIFICATIONS: 'view_notifications',
}

// Check if user has a specific permission (either via role or custom permissions)
export const hasPermission = (user, permission) => {
  if (!user) return false
  
  // Super admin has all permissions
  if (user.role === ROLES.SUPER_ADMIN) return true
  
  // Check custom permissions if available
  if (user.permissions && Array.isArray(user.permissions)) {
    if (user.permissions.includes(permission)) return true
  }
  
  // Fall back to role-based permissions
  const rolePermissions = {
    [ROLES.HOSPITAL_ADMIN]: [
      PERMISSIONS.MANAGE_DOCTORS,
      PERMISSIONS.MANAGE_SERVICES,
      PERMISSIONS.MANAGE_APPOINTMENTS,
      PERMISSIONS.MANAGE_CONTENT,
      PERMISSIONS.VIEW_CONTACT_MESSAGES,
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
    [ROLES.BRANCH_MANAGER]: [
      PERMISSIONS.MANAGE_APPOINTMENTS,
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
    [ROLES.CONTENT_EDITOR]: [
      PERMISSIONS.MANAGE_CONTENT,
      PERMISSIONS.VIEW_DASHBOARD,
      // No notifications for content editor
    ],
    [ROLES.RECEPTION_OFFICER]: [
      PERMISSIONS.MANAGE_APPOINTMENTS,
      PERMISSIONS.VIEW_CONTACT_MESSAGES,
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
    [ROLES.MARKETING_OFFICER]: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
  }
  
  return rolePermissions[user.role]?.includes(permission) || false
}

// Can see notifications
export const canViewNotifications = (user) =>
  hasPermission(user, PERMISSIONS.VIEW_NOTIFICATIONS)

// Can open the Web Editor page at all (view-only or full edit access).
export const canAccessContent = (user) =>
  hasPermission(user, PERMISSIONS.MANAGE_CONTENT) || hasPermission(user, PERMISSIONS.VIEW_CONTENT)

// Can change website text/pages in the Web Editor.
export const canEditContent = (user) =>
  hasPermission(user, PERMISSIONS.MANAGE_CONTENT)

// Can see the Appointments page at all (view-only or full manage access).
export const canViewAppointments = (user) =>
  hasPermission(user, PERMISSIONS.MANAGE_APPOINTMENTS) || hasPermission(user, PERMISSIONS.VIEW_APPOINTMENTS)

// Can book/manage appointment status.
export const canEditAppointments = (user) =>
  hasPermission(user, PERMISSIONS.MANAGE_APPOINTMENTS)

// Can add/edit/delete Doctors, Services, and Branches (any of the three).
export const canEditManagement = (user) =>
  hasPermission(user, PERMISSIONS.MANAGE_DOCTORS) ||
  hasPermission(user, PERMISSIONS.MANAGE_SERVICES) ||
  hasPermission(user, PERMISSIONS.MANAGE_BRANCHES)

// Per-resource checks — used to gate each page/route individually so a
// staff member only granted "Manage Appointments" doesn't also see
// Doctors/Services/Branches just because they share a generic "management" flag.
// "view" versions decide sidebar/page *visibility*; "manage" versions decide
// whether Add/Edit/Delete controls show once inside the page. Manage always
// implies view.
export const canViewDoctors = (user) =>
  hasPermission(user, PERMISSIONS.MANAGE_DOCTORS) || hasPermission(user, PERMISSIONS.VIEW_DOCTORS)
export const canManageDoctors = (user) =>
  hasPermission(user, PERMISSIONS.MANAGE_DOCTORS)

export const canViewServices = (user) =>
  hasPermission(user, PERMISSIONS.MANAGE_SERVICES) || hasPermission(user, PERMISSIONS.VIEW_SERVICES)
export const canManageServices = (user) =>
  hasPermission(user, PERMISSIONS.MANAGE_SERVICES)

export const canViewBranches = (user) =>
  hasPermission(user, PERMISSIONS.MANAGE_BRANCHES) || hasPermission(user, PERMISSIONS.VIEW_BRANCHES)
export const canManageBranches = (user) =>
  hasPermission(user, PERMISSIONS.MANAGE_BRANCHES)

// Can manage staff (only super admin)
export const canManageStaff = (user) =>
  user?.role === ROLES.SUPER_ADMIN

// Can view contact messages
export const canViewContactMessages = (user) =>
  hasPermission(user, PERMISSIONS.VIEW_CONTACT_MESSAGES)

export default {
  ROLES,
  PERMISSIONS,
  hasPermission,
  canAccessContent,
  canEditContent,
  canViewAppointments,
  canEditAppointments,
  canEditManagement,
  canViewDoctors,
  canManageDoctors,
  canViewServices,
  canManageServices,
  canViewBranches,
  canManageBranches,
  canManageStaff,
  canViewContactMessages,
  canViewNotifications,
}