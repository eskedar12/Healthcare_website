import express from 'express'
import { 
  getAllDoctors, 
  getDoctorById, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor,
  uploadDoctorImage
} from '../controllers/doctorController.js'
import { authenticate, requirePermission } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { uploadImage } from '../middleware/upload.js'
import {
  createDoctorValidation,
  updateDoctorValidation,
  doctorIdValidation
} from '../validations/doctorValidation.js'

const router = express.Router()

// GET all doctors (public)
router.get('/', getAllDoctors)

// POST upload a doctor profile photo (admin only) — returns a URL to store
// on the doctor's `image` field. Must come before '/:id' below.
router.post(
  '/upload/image',
  authenticate,
  requirePermission('manage_doctors'),
  uploadImage.single('image'),
  uploadDoctorImage
)

// GET doctor by ID (public)
router.get('/:id', doctorIdValidation, validate, getDoctorById)

// POST create doctor (admin only)
router.post(
  '/',
  authenticate,
  requirePermission('manage_doctors'),
  createDoctorValidation,
  validate,
  createDoctor
)

// PUT update doctor (admin only)
router.put(
  '/:id',
  authenticate,
  requirePermission('manage_doctors'),
  updateDoctorValidation,
  validate,
  updateDoctor
)

// DELETE doctor (admin only)
router.delete('/:id', authenticate, requirePermission('manage_doctors'), doctorIdValidation, validate, deleteDoctor)

export default router
