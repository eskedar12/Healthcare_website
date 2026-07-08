import api from './api'

const convertTo24Hour = (timeStr) => {
  if (!timeStr) return timeStr
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return timeStr
  let [_, hours, minutes, modifier] = match
  hours = parseInt(hours, 10)
  if (modifier.toUpperCase() === 'PM' && hours < 12) {
    hours += 12
  }
  if (modifier.toUpperCase() === 'AM' && hours === 12) {
    hours = 0
  }
  return `${hours.toString().padStart(2, '0')}:${minutes}`
}

export const createAppointment = (payload) => {
  const normalizedPayload = {
    patient_name: payload.patientName || payload.patient_name,
    phone: payload.phone || payload.patient_phone,
    patient_email: payload.email || payload.patient_email,
    service: payload.service || payload.department,
    date: payload.preferredDate || payload.date,
    time: convertTo24Hour(payload.preferredTime || payload.time),
    notes: payload.notes,
  }

  const branchValue = payload.branch || payload.branch_id
  if (branchValue && !isNaN(Number(branchValue))) {
    normalizedPayload.branch_id = parseInt(branchValue, 10)
  } else if (branchValue) {
    normalizedPayload.branch = branchValue
  }

  let doctor_id = payload.preferredDoctor || payload.doctor_id || payload.preferred_doctor
  if (doctor_id && doctor_id !== 'no-preference' && !isNaN(Number(doctor_id))) {
    normalizedPayload.doctor_id = parseInt(doctor_id, 10)
  }

  return api.post('/appointments', normalizedPayload)
}

export const getAppointmentById = (id) => api.get(`/appointments/${id}`)

export default { createAppointment, getAppointmentById }
