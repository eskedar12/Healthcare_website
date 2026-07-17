import express from 'express'
import { createInquiry, getInquiries, updateInquiryStatus } from '../controllers/inquiryController.js'
import { authenticate, requirePermission } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createInquiryValidation } from '../validations/inquiryValidation.js'

const router = express.Router()

// Public — anyone submitting the website contact form
router.post('/', createInquiryValidation, validate, createInquiry)

// Admin/Reception — viewing/managing submitted messages
router.get('/', authenticate, requirePermission('view_contact_messages'), getInquiries)
router.put('/:id', authenticate, requirePermission('view_contact_messages'), updateInquiryStatus)

export default router
