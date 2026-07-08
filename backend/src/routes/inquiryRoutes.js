import express from 'express'
import { createInquiry, getInquiries, updateInquiryStatus } from '../controllers/inquiryController.js'
import { authenticate } from '../middleware/auth.js'
import { checkRole, ROLES } from '../middleware/roleCheck.js'
import { validate } from '../middleware/validate.js'
import { createInquiryValidation } from '../validations/inquiryValidation.js'

const router = express.Router()

// Public — anyone submitting the website contact form
router.post('/', createInquiryValidation, validate, createInquiry)

// Admin — viewing/managing submitted messages
router.get('/', authenticate, checkRole(ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN), getInquiries)
router.put('/:id', authenticate, checkRole(ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN), updateInquiryStatus)

export default router
