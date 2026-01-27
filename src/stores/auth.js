import { ref, computed } from "vue";
import { defineStore } from "pinia";
import {
  loadUsers,
  saveUsers,
  loadSession,
  saveSession,
  clearSession,
} from "@/utils/storage";

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return String(h >>> 0);
}

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
}

export const useAuthStore = defineStore("auth", () => {
  const users = ref(loadUsers());
  const session = ref(loadSession());

  const isLoggedIn = computed(() => !!session.value?.userId);
  const role = computed(() => session.value?.role || "VISITOR");

  const currentUser = computed(() => {
    if (!session.value?.userId) return null;
    return users.value.find((u) => u.id === session.value.userId) || null;
  });

  function persistUsers() {
    saveUsers(users.value);
  }

  function register(payload) {
    users.value = loadUsers();

    const emailExists = users.value.some(
      (u) => u.email.toLowerCase() === payload.email.toLowerCase()
    );
    if (emailExists) throw new Error("Email is already registered.");

    const usernameExists = users.value.some(
      (u) => u.username.toLowerCase() === payload.username.toLowerCase()
    );
    if (usernameExists) throw new Error("Username is already taken.");

    const newUser = {
      id: uid(),
      salutation: payload.salutation,
      salutationOther: payload.salutation === "other" ? (payload.salutationOther || "") : "",
      email: payload.email.trim(),
      username: payload.username.trim(),
      passwordHash: hash(payload.password),
      country: payload.country,
      avatarDataUrl: "", // später Profile Picture
      role: payload.role ?? "USER",
    };

    users.value.push(newUser);
    persistUsers();

    session.value = { userId: newUser.id, role: newUser.role };
    saveSession(session.value);
  }

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

  function logout() {
    session.value = null;
    clearSession();
  }

  function updateProfile(updates) {
    if (!session.value?.userId) throw new Error("Not logged in.");

    users.value = loadUsers();
    const idx = users.value.findIndex((u) => u.id === session.value.userId);
    if (idx === -1) throw new Error("User not found.");

    if (updates.email && updates.email !== users.value[idx].email) {
      const exists = users.value.some(
        (u) =>
          u.id !== users.value[idx].id &&
          u.email.toLowerCase() === updates.email.toLowerCase()
      );
      if (exists) throw new Error("Email is already registered.");
    }

    if (updates.username && updates.username !== users.value[idx].username) {
      const exists = users.value.some(
        (u) =>
          u.id !== users.value[idx].id &&
          u.username.toLowerCase() === updates.username.toLowerCase()
      );
      if (exists) throw new Error("Username is already taken.");
    }

    users.value[idx] = { ...users.value[idx], ...updates };
    persistUsers();
  }

  function setAvatar(dataUrl) {
    updateProfile({ avatarDataUrl: dataUrl });
  }

  function deleteAccount() {
    if (!session.value?.userId) throw new Error("Not logged in.");

    users.value = loadUsers().filter((u) => u.id !== session.value.userId);
    persistUsers();
    logout();
  }

  return {
    users,
    session,

    isLoggedIn,
    role,
    currentUser,

    register,
    login,
    logout,
    updateProfile,
    setAvatar,
    deleteAccount,
  };
});
