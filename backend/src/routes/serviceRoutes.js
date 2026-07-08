import express from 'express'
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js'
import { authenticate } from '../middleware/auth.js'
import { checkRole, ROLES } from '../middleware/roleCheck.js'
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
  checkRole(ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN),
  createServiceValidation,
  validate,
  createService
)

router.put(
  '/:id',
  authenticate,
  checkRole(ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN),
  updateServiceValidation,
  validate,
  updateService
)

router.delete(
  '/:id',
  authenticate,
  checkRole(ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN),
  serviceIdValidation,
  validate,
  deleteService
)

export default router
