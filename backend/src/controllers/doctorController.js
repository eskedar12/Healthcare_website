import { Doctor } from '../models/index.js'
import { sendSuccess, sendCreated, sendNotFound, sendBadRequest } from '../utils/response.js'

export const getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.findAll({
      order: [['created_at', 'DESC']]
    })
    sendSuccess(res, 'Doctors fetched successfully', doctors)
  } catch (error) {
    next(error)
  }
}

export const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params
    const doctor = await Doctor.findByPk(id)

    if (!doctor) {
      return sendNotFound(res, 'Doctor not found')
    }

    sendSuccess(res, 'Doctor fetched successfully', doctor)
  } catch (error) {
    next(error)
  }
}

export const createDoctor = async (req, res, next) => {
  try {
    const { name, title, specialty, department, email, phone, bio, education, languages, branches, is_active } = req.body

    // Validate required fields
    if (!name || !title || !specialty || !email || !phone) {
      return sendBadRequest(res, 'Missing required fields')
    }

    // Check if doctor with same email exists
    const existingDoctor = await Doctor.findOne({ where: { email } })
    if (existingDoctor) {
      return sendBadRequest(res, 'A doctor with this email already exists')
    }

    const doctor = await Doctor.create({
      name,
      title,
      specialty,
      department: department || 'Psychiatry',
      email,
      phone,
      bio,
      education,
      languages,
      branches: branches || [],
      is_active: is_active !== undefined ? is_active : true
    })

    sendCreated(res, 'Doctor created successfully', doctor)
  } catch (error) {
    next(error)
  }
}

export const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, title, specialty, department, email, phone, bio, education, languages, branches, is_active } = req.body

    const doctor = await Doctor.findByPk(id)
    if (!doctor) {
      return sendNotFound(res, 'Doctor not found')
    }

    // Check if email is being changed and already exists
    if (email && email !== doctor.email) {
      const existingDoctor = await Doctor.findOne({ where: { email } })
      if (existingDoctor) {
        return sendBadRequest(res, 'A doctor with this email already exists')
      }
    }

    await doctor.update({
      name: name || doctor.name,
      title: title || doctor.title,
      specialty: specialty || doctor.specialty,
      department: department !== undefined ? department : doctor.department,
      email: email || doctor.email,
      phone: phone || doctor.phone,
      bio: bio !== undefined ? bio : doctor.bio,
      education: education !== undefined ? education : doctor.education,
      languages: languages !== undefined ? languages : doctor.languages,
      branches: branches !== undefined ? branches : doctor.branches,
      is_active: is_active !== undefined ? is_active : doctor.is_active
    })

    sendSuccess(res, 'Doctor updated successfully', doctor)
  } catch (error) {
    next(error)
  }
}

export const deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params

    const doctor = await Doctor.findByPk(id)
    if (!doctor) {
      return sendNotFound(res, 'Doctor not found')
    }

    await doctor.destroy()
    sendSuccess(res, 'Doctor deleted successfully')
  } catch (error) {
    next(error)
  }
}
