import { ref, computed } from "vue";
import { defineStore } from "pinia";
import {
  loadSession,
  saveSession,
  clearSession,
} from "@/utils/storage";

export const useAuthStore = defineStore("auth", () => {
  const session = ref(loadSession());

  const isLoggedIn = computed(() => !!session.value?.userId);
  const role = computed(() => session.value?.role || "VISITOR");
  const currentUser = computed(() => {
    if (!session.value?.userId) return null;
    return {
      id: session.value.userId,
      username: session.value.username,
      role: session.value.role,
    };
  });

  async function login({ emailOrUsername, password }) {
    try {
      // Import axios and API config
      const { default: axios } = await import('axios');
      const { API_BASE_URL } = await import('@/config/api');

      // Call backend API for authentication
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: emailOrUsername,
        password: password,
      });

      // Backend returns: { message, userId, username, token }
      if (response.data && response.data.token) {
        session.value = {
          token: response.data.token,
          userId: response.data.userId,
          username: response.data.username,
        };
        saveSession(session.value);
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      // Handle axios errors
      if (error.response && error.response.status === 401) {
        throw new Error("Invalid email or password.");
      } else if (error.request) {
        throw new Error("Cannot connect to server. Please check if the backend is running.");
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Login failed. Please try again.");
      }
    }
  }

  async function fetchCurrentUser() {
    try {
      const { apiClient } = await import('@/config/api');
      const response = await apiClient.get('/users/me');

      // Update session with user data
      if (response.data && session.value) {
        session.value = {
          ...session.value,
          username: response.data.username,
          userId: response.data.id,
        };
        saveSession(session.value);
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  }

  function logout() {
    session.value = null;
    clearSession();
  }

  return {
    session,

    isLoggedIn,
    role,
    currentUser,

    login,
    logout,
    fetchCurrentUser,
  };
});
