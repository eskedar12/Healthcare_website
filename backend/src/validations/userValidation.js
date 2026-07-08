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
  
  body('role')
    .optional()
    .isIn(['super_admin', 'hospital_admin', 'branch_manager', 'content_editor', 'reception_officer', 'marketing_officer'])
    .withMessage('Invalid role'),
  
  body('branch_id')
    .optional()
    .isInt().withMessage('Branch ID must be an integer'),
  
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active must be a boolean')
];

export const userIdValidation = [
  param('id')
    .isInt().withMessage('User ID must be an integer')
];