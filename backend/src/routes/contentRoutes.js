import express from 'express'
import { getPageContent, updatePageContent, uploadContentImage } from '../controllers/contentController.js'
import { authenticate, requirePermission } from '../middleware/auth.js'
import { uploadImage } from '../middleware/upload.js'

const router = express.Router()

// GET page content (public)
router.get('/:page', getPageContent)

// POST upload an image for use in page content (admin only) — returns a URL
// to store in the relevant content field (e.g. hero.image). Must come before
// the '/:page' POST route below so 'upload' isn't swallowed as a page name.
router.post(
  '/upload/image',
  authenticate,
  requirePermission('manage_content'),
  uploadImage.single('image'),
  uploadContentImage
)

// POST update page content (admin only)
router.post(
  '/:page',
  authenticate,
  requirePermission('manage_content'),
  updatePageContent
)

export default router