import { API_ORIGIN } from '../services/api'

// A doctor's `image` from the API is a relative path like
// "/uploads/content/xyz.jpg" (see EditableImage.jsx for the same pattern).
// Anything already absolute (http(s), data:, blob:) is used as-is.
export const resolveDoctorImage = (value) => {
  if (!value) return null
  if (/^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value
  }
  return `${API_ORIGIN}${value}`
}

// `education` and `languages` are stored on the backend as plain
// comma-separated strings (see admin DoctorForm.jsx), not arrays. This turns
// either shape (string or array, from old static data) into a clean array.
export const toList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return []
}

// Only show doctors that are active and adapt the API shape (title,
// department, is_active) to what the UI components expect.
export const normalizeDoctor = (doctor) => {
  if (!doctor) return null
  return {
    ...doctor,
    role: doctor.title,
    specialty: doctor.specialty,
    image: resolveDoctorImage(doctor.image),
    education: toList(doctor.education),
    languages: toList(doctor.languages),
    departments: doctor.department ? [doctor.department] : [],
  }
}