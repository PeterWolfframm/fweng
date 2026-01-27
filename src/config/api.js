import axios from 'axios'

export const API_BASE_URL = 'http://localhost:8081/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Decode a JWT token and return its payload
 * @param {string} token - The JWT token to decode
 * @returns {Object|null} The decoded payload or null if invalid
 */
export function decodeJwt(token) {
  if (!token) return null
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

/**
 * Check if a JWT token is expired
 * @param {string} token - The JWT token to check
 * @returns {boolean} True if expired or invalid, false if still valid
 */
export function isTokenExpired(token) {
  const payload = decodeJwt(token)
  if (!payload || !payload.exp) return true
  return Date.now() >= payload.exp * 1000 - 30000
}

/**
 * Get the token from localStorage session
 * @returns {string|null} The JWT token or null
 */
export function getStoredToken() {
  const session = localStorage.getItem('session')
  if (!session) return null
  try {
    const { token } = JSON.parse(session)
    return token || null
  } catch {
    return null
  }
}

apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken()
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('session')
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    return Promise.reject(error)
  },
)

/**
 * Fetch all users (for admin user selection)
 * @returns {Promise} Response with array of user objects
 */
export const fetchAllUsers = async () => {
  return await apiClient.get('/users')
}

/**
 * Add a member to a group (requires authentication, admin/creator only)
 * @param {string|number} groupId - The group ID
 * @param {string} userId - The user ID to add
 * @returns {Promise} Response with updated GroupDto object
 */
export const addGroupMember = async (groupId, userId) => {
  return await apiClient.post(`/groups/${groupId}/members`, { userId })
}

/**
 * Join a group (self-service for authenticated users)
 * @param {string|number} groupId - The group ID to join
 * @returns {Promise} Response with updated GroupDto object
 */
export const joinGroup = async (groupId) => {
  return await apiClient.post(`/groups/${groupId}/join`)
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
 * @param {string} name - The group name (5-15 chars)
 * @param {string} [emoji] - Optional emoji for the group (max 10 chars)
 * @param {string} [description] - Optional description for the group (max 500 chars)
 * @returns {Promise} Response with created GroupDto object
 */
export const createGroup = async (name, emoji, description) => {
  const body = { name }
  if (emoji) body.emoji = emoji
  if (description) body.description = description
  return await apiClient.post('/groups', body)
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
 * Fetch groups the authenticated user belongs to
 * @returns {Promise} Response with array of GroupDto objects
 */
export const fetchMyGroups = async () => {
  return await apiClient.get('/groups/my-groups')
}

/**
 * Fetch a single group by ID (public endpoint, no authentication required)
 * @param {string|number} groupId - The group ID
 * @returns {Promise} Response with GroupDto object
 */
export const fetchGroupById = async (groupId) => {
  return await apiClient.get(`/groups/${groupId}`)
}

/**
 * Refresh JWT token
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Response with new token
 */
export const refreshToken = async (email, password) => {
  return await apiClient.post('/auth/token', { email, password })
}

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

/**
 * Update a group
 * @param {string|number} groupId - The group ID to update
 * @param {Object} groupData - Group data (name, emoji?, description?)
 *   - name: string (5-15 chars)
 *   - emoji: string (optional, max 10 chars)
 *   - description: string (optional, max 500 chars)
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

/**
 * Fetch all group posts (public endpoint)
 * @returns {Promise} Response with array of GroupPostResponseDto objects
 * @description GroupPostResponseDto includes: id, groupId, postId, userId, username
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
