import { body, param, query } from 'express-validator';

const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const createAppointmentValidation = [
  body().custom((value, { req }) => {
    const patientName = req.body.patient_name || req.body.patientName;
    const phone = req.body.phone || req.body.patient_phone;
    const branch = req.body.branch || req.body.branch_id;
    const date = req.body.date || req.body.preferred_date || req.body.preferredDate;
    const time = req.body.time || req.body.preferred_time || req.body.preferredTime;

    if (!patientName) {
      throw new Error('Patient name is required');
    }
    if (!phone) {
      throw new Error('Patient phone is required');
    }
    if (!branch) {
      throw new Error('Branch is required');
    }
    if (!date) {
      throw new Error('Preferred date is required');
    }
    if (!time) {
      throw new Error('Preferred time is required');
    }

    return true;
  }),
  body(['patient_name', 'patientName'])
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Patient name must be between 2 and 100 characters'),
  body(['phone', 'patient_phone'])
    .optional()
    .notEmpty().withMessage('Patient phone is required'),
  body(['patient_email', 'email'])
    .optional()
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body(['date', 'preferred_date', 'preferredDate'])
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  body(['time', 'preferred_time', 'preferredTime'])
    .optional()
    .matches(timePattern).withMessage('Invalid time format (HH:MM)'),
  body('branch_id')
    .optional()
    .isInt().withMessage('Branch ID must be an integer'),
  body('branch')
    .optional()
    .isString().withMessage('Branch must be a string'),
  body('department')
    .optional()
    .isString(),
  body('service')
    .optional()
    .isString(),
  body('doctor_id')
    .optional()
    .isInt().withMessage('Doctor ID must be an integer'),
  body('doctor_name')
    .optional()
    .isString(),
  body(['date', 'preferred_date'])
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  body(['time', 'preferred_time'])
    .optional()
    .matches(timePattern).withMessage('Invalid time format (HH:MM)'),
  body('status')
    .optional()
    .isIn(['Pending', 'Confirmed', 'Checked In', 'Cancelled']).withMessage('Invalid status'),
  body('notes')
    .optional()
];

export const updateAppointmentValidation = [
  param('id')
    .isInt().withMessage('Appointment ID must be an integer'),
  
  body('patient_name')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Patient name must be between 2 and 100 characters'),
  
  body('phone')
    .optional(),
  
  body('patient_email')
    .optional()
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('branch_id')
    .optional()
    .isInt().withMessage('Branch ID must be an integer'),
  
  body('department')
    .optional(),
  
  body('service')
    .optional(),
  
  body('preferred_doctor')
    .optional(),
  
  body('preferred_date')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  
  body('preferred_time')
    .optional()
    .matches(timePattern).withMessage('Invalid time format (HH:MM)'),
  
  body('notes')
    .optional()
];

export const statusUpdateValidation = [
  param('id')
    .isInt().withMessage('Appointment ID must be an integer'),
  
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Pending', 'Confirmed', 'Checked In', 'Cancelled'])
    .withMessage('Invalid status')
];

export const appointmentIdValidation = [
  param('id')
    .isInt().withMessage('Appointment ID must be an integer')
];

export const calendarQueryValidation = [
  query('branch_id')
    .optional()
    .isInt().withMessage('Branch ID must be an integer'),
  
  query('date')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  
  query('start_date')
    .optional()
    .isISO8601().withMessage('Invalid start date format'),
  
  query('end_date')
    .optional()
    .isISO8601().withMessage('Invalid end date format')
];

