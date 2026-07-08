import { body, param } from 'express-validator';

export const createBranchValidation = [
  body('name')
    .notEmpty().withMessage('Branch name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Branch name must be between 2 and 100 characters'),
  
  body('address')
    .notEmpty().withMessage('Address is required'),
  
  body('phone')
    .notEmpty().withMessage('Phone number is required'),
  
  body('working_hours')
    .optional()
    .custom((value) => {
      if (typeof value === 'string' || typeof value === 'object') {
        return true
      }
      throw new Error('Working hours must be a string or object')
    }),
  
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active must be a boolean')
];

export const updateBranchValidation = [
  param('id')
    .isInt().withMessage('Branch ID must be an integer'),
  
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Branch name must be between 2 and 100 characters'),
  
  body('address')
    .optional(),
  
  body('phone')
    .optional(),
  
  body('working_hours')
    .optional()
    .custom((value) => {
      if (typeof value === 'string' || typeof value === 'object') {
        return true
      }
      throw new Error('Working hours must be a string or object')
    }),
  
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active must be a boolean')
];

export const branchIdValidation = [
  param('id')
    .isInt().withMessage('Branch ID must be an integer')
];