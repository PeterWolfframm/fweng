import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { loadSession, saveSession, clearSession } from '@/utils/storage'
import { apiClient, decodeJwt, isTokenExpired, API_BASE_URL } from '@/config/api'

export const useAuthStore = defineStore('auth', () => {
  const session = ref(loadSession())

  // Validate stored session on initialization
  if (session.value?.token && isTokenExpired(session.value.token)) {
    session.value = null
    clearSession()
  }

  const isLoggedIn = computed(() => {
    if (!session.value?.userId || !session.value?.token) return false
    // Re-check token expiration on each access
    return !isTokenExpired(session.value.token)
  })

  const role = computed(() => {
    if (!session.value?.token) return 'VISITOR'
    const payload = decodeJwt(session.value.token)
    // JWT typically contains role as 'role' or within 'authorities'
    return payload?.role || payload?.authorities?.[0] || session.value?.role || 'ROLE_USER'
  })

  const currentUser = computed(() => {
    if (!isLoggedIn.value) return null
    return {
      id: session.value.userId,
      username: session.value.username,
      role: role.value,
    }
  })

  async function login({ emailOrUsername, password }) {
    try {
      // Use axios directly for login (no auth header needed)
      const { default: axios } = await import('axios')
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: emailOrUsername,
        password: password,
      })

      // Backend returns: { message, userId, username, token }
      if (response.data && response.data.token) {
        // Decode JWT to extract role
        const payload = decodeJwt(response.data.token)
        
        session.value = {
          token: response.data.token,
          userId: response.data.userId,
          username: response.data.username,
          role: payload?.role || payload?.authorities?.[0] || 'ROLE_USER',
        }
        saveSession(session.value)
      } else {
        throw new Error('Invalid response from server.')
      }
    } catch (error) {
      // Handle axios errors
      if (error.response && error.response.status === 401) {
        throw new Error('Invalid email or password.')
      } else if (error.request) {
        throw new Error('Cannot connect to server. Please check if the backend is running.')
      } else if (error.message) {
        throw new Error(error.message)
      } else {
        throw new Error('Login failed. Please try again.')
      }
    }
  }

  async function fetchCurrentUser() {
    // Don't fetch if token is expired
    if (!session.value?.token || isTokenExpired(session.value.token)) {
      logout()
      return
    }

    try {
      const response = await apiClient.get('/users/me')

      // Update session with user data
      if (response.data && session.value) {
        session.value = {
          ...session.value,
          username: response.data.username,
          userId: response.data.id,
        }
        saveSession(session.value)
      }
    } catch (error) {
      // If unauthorized, the response interceptor will handle cleanup
      if (error.response?.status === 401) {
        logout()
      }
      console.error('Failed to fetch current user:', error)
    }
  }

  /**
   * Validate the current session token
   * @returns {boolean} True if session is valid
   */
  function validateSession() {
    if (!session.value?.token) return false
    if (isTokenExpired(session.value.token)) {
      logout()
      return false
    }
    return true
  }

  function logout() {
    session.value = null
    clearSession()
  }

  return {
    session,

    isLoggedIn,
    role,
    currentUser,

    login,
    logout,
    fetchCurrentUser,
    validateSession,
  }
})
