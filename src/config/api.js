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

/**
 * Fetch all public posts (no authentication required)
 * @returns {Promise} Response with array of PostDto objects
 */
export const fetchPublicPosts = async () => {
  return await apiClient.get('/posts/public')
}

/**
 * Fetch all groups (no authentication required)
 * @returns {Promise} Response with array of GroupDto objects
 */
export const fetchAllGroups = async () => {
  return await apiClient.get('/groups')
}

/**
 * Fetch a single group by ID (requires authentication + read permission)
 * @param {string|number} groupId - The group ID
 * @returns {Promise} Response with GroupDto object
 */
export const fetchGroupById = async (groupId) => {
  return await apiClient.get(`/groups/${groupId}`)
}

// ========== Authentication Endpoints ==========

/**
 * Refresh JWT token
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Response with new token
 */
export const refreshToken = async (email, password) => {
  return await apiClient.post('/auth/token', { email, password })
}

// ========== User Endpoints ==========

/**
 * Fetch a specific user by ID
 * @param {string|number} userId - The user ID
 * @returns {Promise} Response with UserDto object
 */
export const fetchUserById = async (userId) => {
  return await apiClient.get(`/users/${userId}`)
}

/**
 * Update user profile
 * @param {string|number} userId - The user ID to update
 * @param {Object} userData - User data to update (username, email, password)
 * @returns {Promise} Response with updated UserDto object
 */
export const updateUser = async (userId, userData) => {
  return await apiClient.put(`/users/${userId}`, userData)
}

/**
 * Delete user account
 * @param {string|number} userId - The user ID to delete
 * @returns {Promise} Response (204 No Content)
 */
export const deleteUser = async (userId) => {
  return await apiClient.delete(`/users/${userId}`)
}

// ========== Post Endpoints ==========

/**
 * Fetch posts from groups that the user is a member of
 * @returns {Promise} Response with array of PostDto objects
 */
export const fetchGroupPosts = async () => {
  return await apiClient.get('/posts/group-posts')
}

/**
 * Fetch a specific post by ID
 * @param {string|number} postId - The post ID
 * @returns {Promise} Response with PostDto object
 */
export const fetchPostById = async (postId) => {
  return await apiClient.get(`/posts/${postId}`)
}

/**
 * Update a post
 * @param {string|number} postId - The post ID to update
 * @param {Object} postData - Post data (title, body, visibility)
 * @returns {Promise} Response with updated PostDto object
 */
export const updatePost = async (postId, postData) => {
  return await apiClient.put(`/posts/${postId}`, postData)
}

/**
 * Delete a post
 * @param {string|number} postId - The post ID to delete
 * @returns {Promise} Response (204 No Content)
 */
export const deletePost = async (postId) => {
  return await apiClient.delete(`/posts/${postId}`)
}

// ========== Group Endpoints ==========

/**
 * Update a group
 * @param {string|number} groupId - The group ID to update
 * @param {Object} groupData - Group data (name)
 * @returns {Promise} Response with updated GroupDto object
 */
export const updateGroup = async (groupId, groupData) => {
  return await apiClient.put(`/groups/${groupId}`, groupData)
}

/**
 * Delete a group (admin only)
 * @param {string|number} groupId - The group ID to delete
 * @returns {Promise} Response (204 No Content)
 */
export const deleteGroup = async (groupId) => {
  return await apiClient.delete(`/groups/${groupId}`)
}

// ========== Group Post Endpoints ==========

/**
 * Fetch all group posts (public endpoint)
 * @returns {Promise} Response with array of GroupPostDto objects
 */
export const fetchAllGroupPosts = async () => {
  return await apiClient.get('/groupposts')
}

/**
 * Fetch a specific group post by ID
 * @param {string|number} groupPostId - The group post ID
 * @returns {Promise} Response with GroupPostDto object
 */
export const fetchGroupPostById = async (groupPostId) => {
  return await apiClient.get(`/groupposts/${groupPostId}`)
}

/**
 * Create a group post (associate a post with a group)
 * @param {string|number} groupId - The group ID
 * @param {Object} groupPostData - Group post data (groupId, postId)
 * @returns {Promise} Response with created GroupPostDto object
 */
export const createGroupPost = async (groupId, groupPostData) => {
  return await apiClient.post(`/groupposts/${groupId}/posts`, groupPostData)
}

/**
 * Update a group post (admin only)
 * @param {string|number} groupPostId - The group post ID to update
 * @param {Object} groupPostData - Group post data (groupId, postId)
 * @returns {Promise} Response with updated GroupPostDto object
 */
export const updateGroupPost = async (groupPostId, groupPostData) => {
  return await apiClient.put(`/groupposts/${groupPostId}`, groupPostData)
}

/**
 * Delete a group post (admin only)
 * @param {string|number} groupPostId - The group post ID to delete
 * @returns {Promise} Response (204 No Content)
 */
export const deleteGroupPost = async (groupPostId) => {
  return await apiClient.delete(`/groupposts/${groupPostId}`)
}
