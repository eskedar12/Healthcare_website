import express from 'express'
import { getPageContent, updatePageContent } from '../controllers/contentController.js'
import { authenticate } from '../middleware/auth.js'
import { checkRole, ROLES } from '../middleware/roleCheck.js'

const router = express.Router()

// GET page content (public)
router.get('/:page', getPageContent)

// POST update page content (admin only)
router.post(
  '/:page',
  authenticate,
  checkRole(ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN),
  updatePageContent
)

export default router
