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
  
  body('role')
    .optional()
    .isIn(['super_admin', 'hospital_admin', 'branch_manager', 'content_editor', 'reception_officer', 'marketing_officer'])
    .withMessage('Invalid role'),
  
  body('branch_id')
    .optional()
    .isInt().withMessage('Branch ID must be an integer')
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