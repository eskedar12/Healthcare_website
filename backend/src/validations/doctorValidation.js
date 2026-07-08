import { body, param } from 'express-validator';

export const createDoctorValidation = [
  body('name')
    .notEmpty().withMessage('Doctor name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Doctor name must be between 2 and 100 characters'),
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 2, max: 100 }).withMessage('Title must be between 2 and 100 characters'),
  body('specialty')
    .notEmpty().withMessage('Specialty is required')
    .isLength({ min: 2, max: 100 }).withMessage('Specialty must be between 2 and 100 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .notEmpty().withMessage('Phone number is required'),
  body('department')
    .optional()
    .isString(),
  body('bio')
    .optional()
    .isString(),
  body('education')
    .optional()
    .custom((value) => {
      return Array.isArray(value) || typeof value === 'string';
    }).withMessage('Education must be a string or array'),
  body('languages')
    .optional()
    .custom((value) => {
      return Array.isArray(value) || typeof value === 'string';
    }).withMessage('Languages must be a string or array'),
  body('branches')
    .optional()
    .custom((value) => {
      return Array.isArray(value) || typeof value === 'string';
    }).withMessage('Branches must be a string or array'),
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active must be a boolean')
];

export const updateDoctorValidation = [
  param('id')
    .isInt().withMessage('Doctor ID must be an integer'),
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Doctor name must be between 2 and 100 characters'),
  body('title')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Title must be between 2 and 100 characters'),
  body('specialty')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Specialty must be between 2 and 100 characters'),
  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional(),
  body('department')
    .optional()
    .isString(),
  body('bio')
    .optional()
    .isString(),
  body('education')
    .optional()
    .custom((value) => {
      return Array.isArray(value) || typeof value === 'string';
    }).withMessage('Education must be a string or array'),
  body('languages')
    .optional()
    .custom((value) => {
      return Array.isArray(value) || typeof value === 'string';
    }).withMessage('Languages must be a string or array'),
  body('branches')
    .optional()
    .custom((value) => {
      return Array.isArray(value) || typeof value === 'string';
    }).withMessage('Branches must be a string or array'),
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active must be a boolean')
];

export const doctorIdValidation = [
  param('id')
    .isInt().withMessage('Doctor ID must be an integer')
];
