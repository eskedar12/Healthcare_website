import { body } from 'express-validator'

export const createInquiryValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be at most 100 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  body('phone')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 }).withMessage('Phone must be at most 50 characters'),
  body('subject')
    .optional({ checkFalsy: true })
    .isLength({ max: 200 }).withMessage('Subject must be at most 200 characters'),
  body('message')
    .notEmpty().withMessage('Message is required')
]
