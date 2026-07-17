import { body, param } from 'express-validator'

export const createPostValidation = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must be at most 200 characters'),
  body('slug')
    .optional({ nullable: true })
    .isLength({ max: 150 }).withMessage('Slug must be at most 150 characters'),
  body('category')
    .optional({ nullable: true })
    .isLength({ max: 100 }).withMessage('Category must be at most 100 characters'),
  body('excerpt')
    .optional({ nullable: true }),
  body('content')
    .optional(),
  body('image')
    .optional({ nullable: true }),
  body('author')
    .optional({ nullable: true })
    .isLength({ max: 100 }).withMessage('Author must be at most 100 characters'),
  body('is_published')
    .optional()
    .isBoolean().withMessage('is_published must be a boolean')
]

export const updatePostValidation = [
  param('id')
    .isInt().withMessage('Post ID must be an integer'),
  body('title')
    .optional()
    .isLength({ max: 200 }).withMessage('Title must be at most 200 characters'),
  body('slug')
    .optional({ nullable: true })
    .isLength({ max: 150 }).withMessage('Slug must be at most 150 characters'),
  body('category')
    .optional({ nullable: true })
    .isLength({ max: 100 }).withMessage('Category must be at most 100 characters'),
  body('excerpt')
    .optional({ nullable: true }),
  body('content')
    .optional(),
  body('image')
    .optional({ nullable: true }),
  body('author')
    .optional({ nullable: true })
    .isLength({ max: 100 }).withMessage('Author must be at most 100 characters'),
  body('is_published')
    .optional()
    .isBoolean().withMessage('is_published must be a boolean')
]

export const postIdValidation = [
  param('id')
    .isInt().withMessage('Post ID must be an integer')
]
