import axios from 'axios'

const normalizeBaseUrl = (url) => {
  if (!url) return url
  if (url.startsWith(':')) return `http://localhost${url}`
  if (url.startsWith('//')) return `${window.location.protocol}${url}`
  return url.replace(/\/+$/, '')
}

const api = axios.create({
  baseURL: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL) || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default api
