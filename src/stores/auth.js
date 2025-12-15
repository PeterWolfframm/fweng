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

  function login({ emailOrUsername, password }) {
    users.value = loadUsers();

    const pw = hash(password);
    const key = emailOrUsername.toLowerCase();

    const user = users.value.find(
      (u) => u.email.toLowerCase() === key || u.username.toLowerCase() === key
    );

    if (!user || user.passwordHash !== pw) {
      throw new Error("Invalid credentials.");
    }

    session.value = { userId: user.id, role: user.role };
    saveSession(session.value);
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
