import axios from 'axios'

const normalizeBaseUrl = (url) => {
  if (!url) return url
  if (url.startsWith(':')) return `http://localhost${url}`
  if (url.startsWith('//')) return `${window.location.protocol}${url}`
  return url.replace(/\/+$/, '')
}

const resolvedBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL) || 'http://localhost:5000/api'

// The backend also serves uploaded content images outside of /api, e.g.
// http://localhost:5000/uploads/content/xyz.jpg. Editable image components
// use this to turn a relative path stored in content JSON into a full URL.
export const API_ORIGIN = resolvedBaseUrl.replace(/\/api\/?$/, '')

const api = axios.create({
  baseURL: resolvedBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the signed-in admin's JWT to every request so protected routes
// (doctors, services, branches, appointments, staff, inquiries, etc.) don't
// come back as 401s. Opt out per-request with { auth: false } — used by
// login/register, which don't have a token yet.
api.interceptors.request.use((config) => {
  if (config.auth !== false) {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Every backend response is wrapped as { success, message, data }. Unwrap it
// here so callers can just use response.data directly (the array/object
// itself) instead of every page having to reach into response.data.data.
// Left untouched for non-JSON responses (e.g. blob/file downloads), which
// won't have this shape.
api.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      typeof response.data === 'object' &&
      typeof response.data.success === 'boolean' &&
      Object.prototype.hasOwnProperty.call(response.data, 'data')
    ) {
      response.data = response.data.data
    }
    return response
  },
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default api