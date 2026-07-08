import { body, param } from 'express-validator'

export const createServiceValidation = [
  body('code')
    .notEmpty().withMessage('Service code is required')
    .isLength({ max: 20 }).withMessage('Service code must be at most 20 characters'),
  body('name')
    .notEmpty().withMessage('Service name is required')
    .isLength({ max: 100 }).withMessage('Service name must be at most 100 characters'),
  body('duration')
    .notEmpty().withMessage('Duration is required')
    .isLength({ max: 50 }).withMessage('Duration must be at most 50 characters'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isLength({ max: 50 }).withMessage('Price must be at most 50 characters'),
  body('status')
    .optional()
    .isIn(['Active', 'Inactive']).withMessage('Invalid status')
]

export const updateServiceValidation = [
  param('id')
    .isInt().withMessage('Service ID must be an integer'),
  body('code')
    .optional()
    .isLength({ max: 20 }).withMessage('Service code must be at most 20 characters'),
  body('name')
    .optional()
    .isLength({ max: 100 }).withMessage('Service name must be at most 100 characters'),
  body('duration')
    .optional()
    .isLength({ max: 50 }).withMessage('Duration must be at most 50 characters'),
  body('price')
    .optional()
    .isLength({ max: 50 }).withMessage('Price must be at most 50 characters'),
  body('status')
    .optional()
    .isIn(['Active', 'Inactive']).withMessage('Invalid status')
]

export const serviceIdValidation = [
  param('id')
    .isInt().withMessage('Service ID must be an integer')
]
