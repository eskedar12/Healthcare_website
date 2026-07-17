import { 
  createAppointment as createAppointmentService,
  getAllAppointments,
  getAppointmentById,
  getAppointmentByReference as getAppointmentByReferenceService,
  updateAppointment as updateAppointmentService,
  updateAppointmentStatus as updateAppointmentStatusService,
  cancelAppointment as cancelAppointmentService,
  getCalendarData,
  getAppointmentStats as getAppointmentStatsService
} from '../services/appointmentService.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import PDFDocument from 'pdfkit';

export const createAppointment = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;

    // branch_id should only ever be a real numeric ID. If `branch` was sent
    // as a string (the branch name, e.g. from the admin booking form) it
    // must not be treated as an ID — otherwise the lookup in the service
    // layer fails and throws.
    const rawBranch = req.body.branch;
    const branchId = req.body.branch_id || req.body.branchId || (typeof rawBranch === 'number' ? rawBranch : undefined);
    const branchName = req.body.branch_name || req.body.branchName || (typeof rawBranch === 'string' ? rawBranch : undefined);

    const rawDoctor = req.body.preferred_doctor || req.body.preferredDoctor;
    const doctorId = req.body.doctor_id || req.body.doctorId || (typeof rawDoctor === 'number' ? rawDoctor : undefined);
    const doctorName = req.body.doctor_name || req.body.doctorName || (typeof rawDoctor === 'string' ? rawDoctor : undefined);

    const appointmentData = {
      patient_name: req.body.patient_name || req.body.patientName,
      phone: req.body.phone || req.body.patient_phone,
      doctor_id: doctorId,
      doctor_name: doctorName,
      branch_id: branchId,
      branch: branchName,
      date: req.body.date || req.body.preferred_date || req.body.preferredDate,
      time: req.body.time || req.body.preferred_time || req.body.preferredTime,
      status: req.body.status || 'Pending',
      notes: req.body.notes,
      ip_address: ipAddress
    };
    const appointment = await createAppointmentService(appointmentData);
    sendCreated(res, 'Appointment created successfully', appointment);
  } catch (error) {
    next(error);
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    const filters = req.query;
    const appointments = await getAllAppointments(filters);
    sendSuccess(res, 'Appointments retrieved successfully', appointments);
  } catch (error) {
    next(error);
  }
};

export const getAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await getAppointmentById(id);
    sendSuccess(res, 'Appointment retrieved successfully', appointment);
  } catch (error) {
    next(error);
  }
};

export const getAppointmentByReference = async (req, res, next) => {
  try {
    const { ref } = req.params;
    const appointment = await getAppointmentByReferenceService(ref);
    sendSuccess(res, 'Appointment retrieved successfully', appointment);
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await updateAppointmentService(id, req.body);
    sendSuccess(res, 'Appointment updated successfully', appointment);
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const assigned_to = req.body.assigned_to || req.user.id;
    const appointment = await updateAppointmentStatusService(id, status, assigned_to);
    sendSuccess(res, 'Appointment status updated successfully', appointment);
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await cancelAppointmentService(id);
    sendSuccess(res, 'Appointment cancelled successfully', appointment);
  } catch (error) {
    next(error);
  }
};

export const getCalendar = async (req, res, next) => {
  try {
    const filters = req.query;
    const calendarData = await getCalendarData(filters);
    sendSuccess(res, 'Calendar data retrieved successfully', calendarData);
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const filters = req.query;
    const stats = await getAppointmentStatsService(filters);
    sendSuccess(res, 'Appointment statistics retrieved successfully', stats);
  } catch (error) {
    next(error);
  }
};

export const exportAppointmentsPDF = async (req, res, next) => {
  try {
    const filters = req.query;
    const appointments = await getAllAppointments(filters);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=appointments.pdf');
    
    const doc = new PDFDocument();
    doc.pipe(res);
    
    // Header
    doc.fontSize(20).text('Appointments Report', { align: 'center' });
    doc.moveDown();
    
    // Table
    const tableTop = 100;
    const tableLeft = 50;
    const colWidths = [80, 100, 100, 80, 80, 80, 70];
    const headers = ['Ref', 'Patient', 'Doctor', 'Branch', 'Date', 'Time', 'Status'];
    
    // Draw headers
    doc.fontSize(10).font('Helvetica-Bold');
    let x = tableLeft;
    headers.forEach((header, i) => {
      doc.text(header, x, tableTop, { width: colWidths[i], align: 'left' });
      x += colWidths[i];
    });
    
    // Draw line under headers
    doc.moveTo(tableLeft, tableTop + 20).lineTo(600, tableTop + 20).stroke();
    
    // Draw rows
    doc.font('Helvetica');
    let y = tableTop + 30;
    appointments.forEach((appt) => {
      x = tableLeft;
      const rowData = [
        appt.reference_number,
        appt.patient_name,
        appt.doctor_name || 'N/A',
        appt.branch || 'N/A',
        appt.date,
        appt.time,
        appt.status
      ];
      rowData.forEach((text, i) => {
        doc.text(text, x, y, { width: colWidths[i], align: 'left' });
        x += colWidths[i];
      });
      y += 20;
      
      // Add new page if needed
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
    });
    
    doc.end();
  } catch (error) {
    next(error);
  }
};