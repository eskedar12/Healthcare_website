import express from 'express'
import { 
  getAllDoctors, 
  getDoctorById, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor 
} from '../controllers/doctorController.js'
import { authenticate } from '../middleware/auth.js'
import { checkRole, ROLES } from '../middleware/roleCheck.js'
import { validate } from '../middleware/validate.js'
import {
  createDoctorValidation,
  updateDoctorValidation,
  doctorIdValidation
} from '../validations/doctorValidation.js'

const router = express.Router()

// GET all doctors (public)
router.get('/', getAllDoctors)

// GET doctor by ID (public)
router.get('/:id', doctorIdValidation, validate, getDoctorById)

// POST create doctor (admin only)
router.post(
  '/',
  authenticate,
  checkRole(ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN),
  createDoctorValidation,
  validate,
  createDoctor
)

// PUT update doctor (admin only)
router.put(
  '/:id',
  authenticate,
  checkRole(ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN),
  updateDoctorValidation,
  validate,
  updateDoctor
)

// DELETE doctor (admin only)
router.delete('/:id', authenticate, checkRole(ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN), doctorIdValidation, validate, deleteDoctor)

export default router
