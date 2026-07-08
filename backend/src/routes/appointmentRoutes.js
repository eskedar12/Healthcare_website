import express from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointment,
  getAppointmentByReference,
  updateAppointment,
  updateAppointmentStatus,
  cancelAppointment,
  getCalendar,
  getStats
} from '../controllers/appointmentController.js';
import { authenticate } from '../middleware/auth.js';
import { checkRole, ROLES } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { 
  createAppointmentValidation, 
  updateAppointmentValidation, 
  statusUpdateValidation,
  appointmentIdValidation,
  calendarQueryValidation
} from '../validations/appointmentValidation.js';

const router = express.Router();

// Public routes
router.post(
  '/', 
  createAppointmentValidation, 
  validate, 
  createAppointment
);

router.get('/reference/:ref', getAppointmentByReference);

// Protected routes (Staff only)
router.use(authenticate);

router.get(
  '/', 
  getAppointments
);

router.get(
  '/calendar', 
  calendarQueryValidation, 
  validate, 
  getCalendar
);

router.get(
  '/stats', 
  getStats
);

router.get(
  '/:id', 
  appointmentIdValidation, 
  validate, 
  getAppointment
);

router.put(
  '/:id', 
  updateAppointmentValidation, 
  validate, 
  updateAppointment
);

router.patch(
  '/:id/status', 
  statusUpdateValidation, 
  validate, 
  updateAppointmentStatus
);

router.delete(
  '/:id', 
  appointmentIdValidation, 
  validate, 
  cancelAppointment
);

export default router;