import api from './api'

export const getDepartments = (params = {}) => api.get('/departments', { params })
export const getDepartmentById = (id) => api.get(`/departments/${id}`)

export default { getDepartments, getDepartmentById }
