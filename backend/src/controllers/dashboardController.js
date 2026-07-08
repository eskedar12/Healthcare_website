import { Op, fn, col, literal } from 'sequelize'
import { Appointment, Doctor, Branch } from '../models/index.js'
import { sendSuccess } from '../utils/response.js'

export const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0]

    const [
      appointmentsToday,
      activePatientsRow,
      clinicalStaff,
      branchesCount,
      pendingAppointments
    ] = await Promise.all([
      Appointment.count({ where: { date: today } }),
      // "Active patients" = distinct patients who have booked an appointment.
      // There's no separate patient-onboarding flow yet, so a patient's
      // phone number is the best available unique identifier.
      Appointment.findOne({
        attributes: [[fn('COUNT', literal('DISTINCT phone')), 'count']],
        raw: true
      }),
      Doctor.count({ where: { is_active: true } }),
      Branch.count(),
      Appointment.count({ where: { status: 'Pending' } })
    ])

    const activePatients = parseInt(activePatientsRow?.count || 0, 10)

    sendSuccess(res, 'Dashboard stats retrieved successfully', {
      appointmentsToday,
      activePatients,
      clinicalStaff,
      branches: branchesCount,
      pendingAppointments
    })
  } catch (error) {
    next(error)
  }
}
