import axios from 'axios'

const publicApi = axios.create({
  baseURL: 'http://localhost:5000/api/public',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add response interceptor for debugging
publicApi.interceptors.response.use(
  (response) => {
    console.log('✅ Public API Response:', response.config.url, response.data)
    return response
  },
  (error) => {
    console.error('❌ Public API Error:', error.config?.url, error.message)
    return Promise.reject(error)
  }
)

export default publicApi