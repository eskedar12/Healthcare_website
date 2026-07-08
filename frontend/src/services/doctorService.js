import api from './api'

export const getDoctors = (params = {}) => api.get('/doctors', { params })
export const getDoctorById = (id) => api.get(`/doctors/${id}`)

export default { getDoctors, getDoctorById }
