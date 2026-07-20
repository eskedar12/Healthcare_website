import axios from 'axios'

const normalizeBaseUrl = (url) => {
  if (!url) return url
  if (url.startsWith(':')) return `http://localhost${url}`
  if (url.startsWith('//')) return `${window.location.protocol}${url}`
  return url.replace(/\/+$/, '')
}

const resolvedBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL) || 'http://localhost:5000/api'

// The backend also serves uploaded content images outside of /api, e.g.
// http://localhost:5000/uploads/content/xyz.jpg. EditableImage uses this to
// turn a relative path stored in content JSON into a full URL.
export const API_ORIGIN = resolvedBaseUrl.replace(/\/api\/?$/, '')

const api = axios.create({
  baseURL: resolvedBaseUrl,
  // Render's free tier spins the backend down after ~15 minutes of
  // inactivity; the first request after that has to wait for a cold
  // start, which can take 30-60s. 15s was cutting that off before the
  // server even finished waking up.
  timeout: 45000,
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