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
  getStats,
  exportAppointmentsPDF
} from '../controllers/appointmentController.js';
import { authenticate, requirePermission } from '../middleware/auth.js';
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

// Protected routes (Staff only). Reading appointments only requires
// view_appointments OR manage_appointments; changing them (update/status/
// cancel) requires manage_appointments specifically — this lets a "View
// only" staff account (e.g. an HR account granted just View Appointments)
// see the list without being able to edit it.
router.use(authenticate);

router.get(
  '/', 
  requirePermission('view_appointments', 'manage_appointments'),
  getAppointments
);

router.get(
  '/export/pdf', 
  requirePermission('view_appointments', 'manage_appointments'),
  exportAppointmentsPDF
);

router.get(
  '/calendar', 
  requirePermission('view_appointments', 'manage_appointments'),
  calendarQueryValidation, 
  validate, 
  getCalendar
);

router.get(
  '/stats', 
  requirePermission('view_appointments', 'manage_appointments'),
  getStats
);

router.get(
  '/:id', 
  requirePermission('view_appointments', 'manage_appointments'),
  appointmentIdValidation, 
  validate, 
  getAppointment
);

router.put(
  '/:id', 
  requirePermission('manage_appointments'),
  updateAppointmentValidation, 
  validate, 
  updateAppointment
);

router.patch(
  '/:id/status', 
  requirePermission('manage_appointments'),
  statusUpdateValidation, 
  validate, 
  updateAppointmentStatus
);

router.delete(
  '/:id', 
  requirePermission('manage_appointments'),
  appointmentIdValidation, 
  validate, 
  cancelAppointment
);

export default router;