import express from 'express'
import {
  getPosts,
  getPost,
  getPostBySlugHandler,
  createPost,
  updatePost,
  deletePost
} from '../controllers/postController.js'
import { authenticate, requirePermission } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import {
  createPostValidation,
  updatePostValidation,
  postIdValidation
} from '../validations/postValidation.js'

const router = express.Router()

// Public — Blog and Blog detail pages read these without auth
router.get('/', getPosts)
router.get('/slug/:slug', getPostBySlugHandler)
router.get('/:id', postIdValidation, validate, getPost)

// Managed alongside site content, same as the Web Editor and Projects
router.post(
  '/',
  authenticate,
  requirePermission('manage_content'),
  createPostValidation,
  validate,
  createPost
)

router.put(
  '/:id',
  authenticate,
  requirePermission('manage_content'),
  updatePostValidation,
  validate,
  updatePost
)

router.delete(
  '/:id',
  authenticate,
  requirePermission('manage_content'),
  postIdValidation,
  validate,
  deletePost
)

export default router
