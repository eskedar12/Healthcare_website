import api from './api'

export const getServices = (params = {}) => api.get('/services', { params })
export const getServiceBySlug = (slug) => api.get(`/services/${slug}`)

export default { getServices, getServiceBySlug }
