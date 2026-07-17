import { body, param } from 'express-validator';

export const updateUserValidation = [
  param('id')
    .isInt().withMessage('User ID must be an integer'),
  
  body('full_name')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('phone_number')
    .optional(),
  
  // Free text now — no longer restricted to a fixed role list.
  body('role')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Role must be between 2 and 100 characters'),

  body('branch_id')
    .optional()
    .isInt().withMessage('Branch ID must be an integer'),

  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active must be a boolean'),

  body('permissions')
    .optional()
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

export const userIdValidation = [
  param('id')
    .isInt().withMessage('User ID must be an integer')
];