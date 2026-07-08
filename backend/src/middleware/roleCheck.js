import { sendForbidden } from '../utils/response.js';

export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendForbidden(res, 'User not authenticated');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendForbidden(res, 'Insufficient permissions');
    }

    next();
  };
};

// Role constants for easier use
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  HOSPITAL_ADMIN: 'hospital_admin',
  BRANCH_MANAGER: 'branch_manager',
  CONTENT_EDITOR: 'content_editor',
  RECEPTION_OFFICER: 'reception_officer',
  MARKETING_OFFICER: 'marketing_officer'
};