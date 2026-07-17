import express from 'express'
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js'
import { authenticate, requirePermission } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import {
  createProjectValidation,
  updateProjectValidation,
  projectIdValidation
} from '../validations/projectValidation.js'

const router = express.Router()

// Public — the Projects page on the site reads the list without auth
router.get('/', getProjects)
router.get('/:id', projectIdValidation, validate, getProject)

// Managed alongside site content, same as the Web Editor
router.post(
  '/',
  authenticate,
  requirePermission('manage_content'),
  createProjectValidation,
  validate,
  createProject
)

router.put(
  '/:id',
  authenticate,
  requirePermission('manage_content'),
  updateProjectValidation,
  validate,
  updateProject
)

router.delete(
  '/:id',
  authenticate,
  requirePermission('manage_content'),
  projectIdValidation,
  validate,
  deleteProject
)

export default router
