import api from './api'

export const createInquiry = (payload) => api.post('/inquiries', payload)

export default { createInquiry }
