import axios from 'axios'

// Base URL for the backend API
export const API_BASE_URL = 'http://localhost:8081/api'

// Configured axios instance with default settings
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include JWT token if available
apiClient.interceptors.request.use(
  (config) => {
    const session = localStorage.getItem('session')
    if (session) {
      try {
        const { token } = JSON.parse(session)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch {
        // Invalid session data, ignore
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
