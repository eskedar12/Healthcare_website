import express from 'express'
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js'
import { authenticate, requirePermission } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import {
  createServiceValidation,
  updateServiceValidation,
  serviceIdValidation
} from '../validations/serviceValidation.js'

const router = express.Router()

router.get('/', getServices)
router.get('/:id', serviceIdValidation, validate, getService)

router.post(
  '/',
  authenticate,
  requirePermission('manage_services'),
  createServiceValidation,
  validate,
  createService
)

router.put(
  '/:id',
  authenticate,
  requirePermission('manage_services'),
  updateServiceValidation,
  validate,
  updateService
)

router.delete(
  '/:id',
  authenticate,
  requirePermission('manage_services'),
  serviceIdValidation,
  validate,
  deleteService
)

export default router
