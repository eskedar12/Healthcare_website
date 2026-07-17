import { body, param } from 'express-validator'

export const createProjectValidation = [
  body('name')
    .notEmpty().withMessage('Project name is required')
    .isLength({ max: 200 }).withMessage('Project name must be at most 200 characters'),
  body('description')
    .optional({ nullable: true }),
  body('year')
    .optional({ nullable: true })
    .isLength({ max: 10 }).withMessage('Year must be at most 10 characters'),
  body('is_featured')
    .optional()
    .isBoolean().withMessage('is_featured must be a boolean'),
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active must be a boolean'),
  body('sort_order')
    .optional()
    .isInt().withMessage('sort_order must be an integer')
]

export const updateProjectValidation = [
  param('id')
    .isInt().withMessage('Project ID must be an integer'),
  body('name')
    .optional()
    .isLength({ max: 200 }).withMessage('Project name must be at most 200 characters'),
  body('description')
    .optional({ nullable: true }),
  body('year')
    .optional({ nullable: true })
    .isLength({ max: 10 }).withMessage('Year must be at most 10 characters'),
  body('is_featured')
    .optional()
    .isBoolean().withMessage('is_featured must be a boolean'),
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active must be a boolean'),
  body('sort_order')
    .optional()
    .isInt().withMessage('sort_order must be an integer')
]

export const projectIdValidation = [
  param('id')
    .isInt().withMessage('Project ID must be an integer')
]
