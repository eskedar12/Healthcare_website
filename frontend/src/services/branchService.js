import api from './api'

export const getBranches = (params = {}) => api.get('/branches', { params })
export const getBranchById = (id) => api.get(`/branches/${id}`)

export default { getBranches, getBranchById }
