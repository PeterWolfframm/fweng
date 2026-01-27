import axios from 'axios'

// Base URL for the backend API
export const API_BASE_URL = 'http://localhost:8080/api'

// Configured axios instance with default settings
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include JWT token if available
apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem("session");
  if (!raw) return config;

  try {
    const { token } = JSON.parse(raw) || {};
    if (!token) return config;

    const cleaned = String(token).replace(/^Bearer\s+/i, "").trim();

    // sorgt dafür, dass headers IMMER existiert:
    config.headers = config.headers || {};

    // Axios kann je nach Version AxiosHeaders nutzen -> beide Varianten ok:
    if (typeof config.headers.set === "function") {
      config.headers.set("Authorization", `Bearer ${cleaned}`);
    } else {
      config.headers["Authorization"] = `Bearer ${cleaned}`;
    }
  } catch {
    // ignore
  }

  return config;
});


// API Methods

/**
 * Fetch all users (for admin user selection)
 * @returns {Promise} Response with array of user objects
 */
export const fetchAllUsers = async () => {
  return await apiClient.get('/users')
}

/**
 * Add a member to a group
 * @param {string|number} groupId - The group ID
 * @param {string} userId - The user ID to add
 * @returns {Promise} Response with updated GroupDto object
 */
export const addGroupMember = async (groupId, userId) => {
  return await apiClient.post(`/groups/${groupId}/members`, { userId })
}

/**
 * Get overview of all user-group memberships (admin only)
 * @returns {Promise} Response with array of UserGroupViewDto objects
 */
export const fetchGroupMemberships = async () => {
  return await apiClient.get('/groups/memberships')
}

/**
 * Create a new group
 * @param {string} name - The group name
 * @returns {Promise} Response with created GroupDto object
 */
export const createGroup = async (name) => {
  return await apiClient.post('/groups', { name })
}

/**
 * Fetch all posts
 * @returns {Promise} Response with array of PostDto objects
 */
export const fetchAllPosts = async () => {
  return await apiClient.get('/posts')
}

export const fetchPublicPosts = async () => {
  return await apiClient.get('/posts/public')
}

export const fetchGroupPosts = async () => {
  return await apiClient.get('/posts/group-posts')
}

export const fetchFeedPosts = async () => {
  return await apiClient.get("/posts/feed");
}

export const fetchMyPosts = async () => {
  return await apiClient.get("/posts/my-posts");
}
