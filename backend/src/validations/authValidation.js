import { body } from 'express-validator';

export const registerValidation = [
  body('full_name')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('phone_number')
    .notEmpty().withMessage('Phone number is required'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  
  // Free text now — the admin creating the account types the role name
  // directly instead of picking from a fixed list.
  body('role')
    .notEmpty().withMessage('Role is required')
    .isLength({ min: 2, max: 100 }).withMessage('Role must be between 2 and 100 characters'),

  body('branch_id')
    .optional()
    .isInt().withMessage('Branch ID must be an integer'),

  // Permissions are now required and functional, not an optional extra —
  // this is what actually controls what the account can do.
  body('permissions')
    .isArray({ min: 1 }).withMessage('Select at least one permission')
    .custom((value) => {
      const allowed = new Set([
        'manage_doctors',
        'view_doctors',
        'manage_services',
        'view_services',
        'manage_branches',
        'view_branches',
        'manage_appointments',
        'view_appointments',
        'manage_content',
        'view_content',
        'manage_staff',
        'view_contact_messages',
        'view_dashboard',
        'view_notifications'
      ])
      if (!value.every((p) => allowed.has(p))) {
        throw new Error('Permissions contain an invalid value')
      }
      return true
    })
];

export const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

export const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required')
];