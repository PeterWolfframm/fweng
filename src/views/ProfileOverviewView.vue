<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { apiClient, fetchAllUsers, addGroupMember, fetchGroupMemberships, createGroup as createGroupApi, updatePost, deletePost, fetchAllGroups, createGroupPost } from '@/config/api'
import ErrorDisplayComponent from '@/components/ErrorDisplayComponent.vue'
import PostPreviewCard from '@/components/PostPreviewCard.vue'
import GroupPreviewCard from '@/components/GroupPreviewCard.vue'

const auth = useAuthStore()

// Check if current user is admin
const isAdmin = computed(() => auth.role === 'ADMIN')

// Form data for create post
const postTitle = ref('')
const postBody = ref('')
const postVisibility = ref('PUBLIC')
const selectedGroupId = ref('')

// UI state
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

// Available groups for dropdown
const availableGroups = ref([])
const isLoadingAvailableGroups = ref(false)

// User posts state
const userPosts = ref([])
const isLoadingPosts = ref(false)
const postsErrorMessage = ref('')

// Form data for create group
const groupName = ref('')

// UI state for group creation
const groupErrorMessage = ref('')
const groupSuccessMessage = ref('')
const isLoadingGroup = ref(false)

// User groups state
const userGroups = ref([])
const isLoadingGroups = ref(false)
const groupsErrorMessage = ref('')

// All users state (for admin dropdown)
const allUsers = ref([])
const isLoadingUsers = ref(false)
const usersErrorMessage = ref('')

// Selected user per group (for adding members)
const selectedUserIds = ref({})

// Member management state
const addingMemberToGroupId = ref(null)
const memberSuccessMessage = ref('')
const memberErrorMessage = ref('')

// Group memberships overview (admin only)
const groupMemberships = ref([])
const isLoadingMemberships = ref(false)
const membershipsErrorMessage = ref('')

// User's group memberships state
const userGroupMemberships = ref([])
const isLoadingUserMemberships = ref(false)
const userMembershipsErrorMessage = ref('')

// Post edit/delete state
const editingPostId = ref(null)
const editPostTitle = ref('')
const editPostBody = ref('')
const editPostVisibility = ref('PUBLIC')
const isUpdatingPost = ref(false)
const isDeletingPostId = ref(null)
const postActionError = ref('')
const postActionSuccess = ref('')

// Fetch user's posts
const fetchUserPosts = async () => {
  isLoadingPosts.value = true
  postsErrorMessage.value = ''
  
  try {
    const response = await apiClient.get('/posts/my-posts')
    
    // Map API response to match PostPreviewCard expected format
    userPosts.value = response.data.map(post => ({
      id: post.id,
      title: post.title,
      content: post.body,  // Map 'body' to 'content'
      icon: '📝'           // Default icon for user posts
    }))
  } catch (error) {
    if (error.response?.data?.message) {
      postsErrorMessage.value = error.response.data.message
    } else if (error.response?.status === 401) {
      postsErrorMessage.value = 'You must be logged in to view your posts'
    } else {
      postsErrorMessage.value = 'Failed to load your posts'
    }
  } finally {
    isLoadingPosts.value = false
  }
}

// Fetch user's groups
const fetchUserGroups = async () => {
  isLoadingGroups.value = true
  groupsErrorMessage.value = ''
  
  try {
    console.log('[ProfileOverview] Fetching user groups from /groups/my-groups...')
    const response = await apiClient.get('/groups/my-groups')
    console.log('[ProfileOverview] Received groups:', response.data)
    
    // Map API response to match GroupPreviewCard expected format
    userGroups.value = response.data.map(group => ({
      id: group.id,
      name: group.name,
      icon: '👫',  // Default icon since API doesn't provide it
      description: `Created by ${group.createdByUsername || 'Unknown'}`
    }))
    console.log('[ProfileOverview] Mapped user groups:', userGroups.value)
  } catch (error) {
    console.error('[ProfileOverview] Error fetching groups:', error)
    if (error.response?.data?.message) {
      groupsErrorMessage.value = error.response.data.message
    } else if (error.response?.status === 401) {
      groupsErrorMessage.value = 'You must be logged in to view your groups'
    } else {
      groupsErrorMessage.value = 'Failed to load your groups'
    }
  } finally {
    isLoadingGroups.value = false
  }
}

// Fetch all users (admin only - for dropdown)
const fetchUsers = async () => {
  if (!isAdmin.value) return
  
  isLoadingUsers.value = true
  usersErrorMessage.value = ''
  
  try {
    const response = await fetchAllUsers()
    allUsers.value = response.data
  } catch (error) {
    if (error.response?.data?.message) {
      usersErrorMessage.value = error.response.data.message
    } else if (error.response?.status === 401) {
      usersErrorMessage.value = 'You must be logged in to view users'
    } else {
      usersErrorMessage.value = 'Failed to load users'
    }
  } finally {
    isLoadingUsers.value = false
  }
}

// Fetch group memberships overview (admin only)
const fetchMemberships = async () => {
  if (!isAdmin.value) return
  
  isLoadingMemberships.value = true
  membershipsErrorMessage.value = ''
  
  try {
    const response = await fetchGroupMemberships()
    groupMemberships.value = response.data
  } catch (error) {
    if (error.response?.data?.message) {
      membershipsErrorMessage.value = error.response.data.message
    } else if (error.response?.status === 401) {
      membershipsErrorMessage.value = 'You must be logged in to view memberships'
    } else {
      membershipsErrorMessage.value = 'Failed to load memberships'
    }
  } finally {
    isLoadingMemberships.value = false
  }
}

// Fetch user's group memberships
const fetchUserGroupMemberships = async () => {
  isLoadingUserMemberships.value = true
  userMembershipsErrorMessage.value = ''
  
  try {
    const response = await apiClient.get('/groups/my-groups')
    
    // Map API response to match GroupPreviewCard expected format
    userGroupMemberships.value = response.data.map(group => ({
      id: group.id,
      name: group.name,
      icon: '👫',
      description: `Created by ${group.createdByUsername || 'Unknown'}`
    }))
  } catch (error) {
    if (error.response?.data?.message) {
      userMembershipsErrorMessage.value = error.response.data.message
    } else if (error.response?.status === 401) {
      userMembershipsErrorMessage.value = 'You must be logged in to view your memberships'
    } else {
      userMembershipsErrorMessage.value = 'Failed to load your memberships'
    }
  } finally {
    isLoadingUserMemberships.value = false
  }
}

// Fetch available groups for post creation dropdown
const fetchAvailableGroups = async () => {
  isLoadingAvailableGroups.value = true
  
  try {
    const response = await fetchAllGroups()
    availableGroups.value = response.data
  } catch (error) {
    console.error('[ProfileOverview] Error fetching available groups:', error)
    // Silently fail - user can still create posts without groups
  } finally {
    isLoadingAvailableGroups.value = false
  }
}

// Add member to group
const handleAddMember = async (groupId) => {
  const userId = selectedUserIds.value[groupId]
  
  if (!userId) {
    memberErrorMessage.value = 'Please select a user'
    return
  }
  
  memberErrorMessage.value = ''
  memberSuccessMessage.value = ''
  addingMemberToGroupId.value = groupId
  
  try {
    await addGroupMember(groupId, userId)
    
    memberSuccessMessage.value = 'Member added successfully!'
    
    // Clear selection
    selectedUserIds.value[groupId] = ''
    
    // Refresh memberships if visible
    if (isAdmin.value) {
      await fetchMemberships()
    }
    
    setTimeout(() => {
      memberSuccessMessage.value = ''
    }, 3000)
  } catch (error) {
    if (error.response?.data?.message) {
      memberErrorMessage.value = error.response.data.message
    } else if (error.response?.status === 401) {
      memberErrorMessage.value = 'You must be logged in to add members'
    } else if (error.request) {
      memberErrorMessage.value = 'Network error. Please try again.'
    } else {
      memberErrorMessage.value = 'Failed to add member. Please try again.'
    }
  } finally {
    addingMemberToGroupId.value = null
  }
}

// Load posts and groups on component mount
onMounted(() => {
  fetchUserPosts()
  fetchUserGroups()
  fetchUserGroupMemberships()
  fetchAvailableGroups()
  
  // Fetch users and memberships if admin
  if (isAdmin.value) {
    fetchUsers()
    fetchMemberships()
  }
})

// Handle post creation
const createPost = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  // Validation
  if (!postTitle.value.trim()) {
    errorMessage.value = 'Please enter a title'
    return
  }
  
  if (postTitle.value.trim().length < 3 || postTitle.value.trim().length > 30) {
    errorMessage.value = 'Title must be between 3 and 30 characters'
    return
  }
  
  if (!postBody.value.trim()) {
    errorMessage.value = 'Please enter post content'
    return
  }
  
  if (postBody.value.trim().length < 3 || postBody.value.trim().length > 100) {
    errorMessage.value = 'Body must be between 3 and 100 characters'
    return
  }
  
  isLoading.value = true

  try {
    // Create the post
    const response = await apiClient.post('/posts', {
      title: postTitle.value.trim(),
      body: postBody.value.trim(),
      visibility: postVisibility.value
    })
    
    const createdPostId = response.data.id
    
    // If a group is selected, add the post to the group
    if (selectedGroupId.value) {
      try {
        await createGroupPost(selectedGroupId.value, { postId: createdPostId })
        
        // Find the group name for success message
        const selectedGroup = availableGroups.value.find(g => g.id === selectedGroupId.value)
        const groupName = selectedGroup ? selectedGroup.name : 'group'
        
        successMessage.value = `Post created and added to ${groupName}!`
      } catch (groupError) {
        console.error('[ProfileOverview] Error adding post to group:', groupError)
        successMessage.value = 'Post created successfully, but failed to add to group'
      }
    } else {
      successMessage.value = 'Post created successfully!'
    }
    
    // Clear form
    postTitle.value = ''
    postBody.value = ''
    postVisibility.value = 'PUBLIC'
    selectedGroupId.value = ''
    
    // Refresh posts list to show new post
    await fetchUserPosts()
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    // Extract error message from API response
    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else if (error.response?.status === 401) {
      errorMessage.value = 'You must be logged in to create a post'
    } else if (error.message) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Failed to create post. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

// Handle group creation
const createGroup = async () => {
  groupErrorMessage.value = ''
  groupSuccessMessage.value = ''
  
  // Validation
  if (!groupName.value.trim()) {
    groupErrorMessage.value = 'Please enter a group name'
    return
  }
  
  if (groupName.value.trim().length < 5 || groupName.value.trim().length > 15) {
    groupErrorMessage.value = 'Group name must be between 5 and 15 characters'
    return
  }
  
  isLoadingGroup.value = true
  const groupNameToCreate = groupName.value.trim()

  try {
    console.log('[ProfileOverview] Creating group with name:', groupNameToCreate)
    const response = await createGroupApi(groupNameToCreate)
    console.log('[ProfileOverview] Group created successfully:', response.data)
    
    groupSuccessMessage.value = 'Group created successfully!'
    
    // Clear form
    groupName.value = ''
    
    // Store count before refresh to detect if new group appears
    const groupsCountBefore = userGroups.value.length
    console.log('[ProfileOverview] Groups count before refresh:', groupsCountBefore)
    
    // Refresh groups list to show new group
    await fetchUserGroups()
    
    // Check if the new group appeared in the list
    const groupsCountAfter = userGroups.value.length
    console.log('[ProfileOverview] Groups count after refresh:', groupsCountAfter)
    
    if (groupsCountAfter <= groupsCountBefore) {
      console.warn('[ProfileOverview] WARNING: New group was not found in my-groups list!')
      console.warn('[ProfileOverview] This likely means the backend did not add you as a member automatically.')
      groupErrorMessage.value = 'Group created, but you may not have been added as a member. Please contact an administrator.'
      groupSuccessMessage.value = ''
    }
    
    setTimeout(() => {
      groupSuccessMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('[ProfileOverview] Error creating group:', error)
    // Extract error message from API response
    if (error.response?.data?.message) {
      groupErrorMessage.value = error.response.data.message
    } else if (error.response?.status === 401) {
      groupErrorMessage.value = 'You must be logged in to create a group'
    } else if (error.message) {
      groupErrorMessage.value = error.message
    } else {
      groupErrorMessage.value = 'Failed to create group. Please try again.'
    }
  } finally {
    isLoadingGroup.value = false
  }
}

// Start editing a post
const startEditPost = (post) => {
  editingPostId.value = post.id
  editPostTitle.value = post.title
  editPostBody.value = post.content
  editPostVisibility.value = post.visibility || 'PUBLIC'
  postActionError.value = ''
  postActionSuccess.value = ''
}

// Cancel editing
const cancelEditPost = () => {
  editingPostId.value = null
  editPostTitle.value = ''
  editPostBody.value = ''
  editPostVisibility.value = 'PUBLIC'
  postActionError.value = ''
}

// Update post
const handleUpdatePost = async (postId) => {
  postActionError.value = ''
  postActionSuccess.value = ''
  
  // Validation
  if (!editPostTitle.value.trim()) {
    postActionError.value = 'Please enter a title'
    return
  }
  
  if (editPostTitle.value.trim().length < 3 || editPostTitle.value.trim().length > 30) {
    postActionError.value = 'Title must be between 3 and 30 characters'
    return
  }
  
  if (!editPostBody.value.trim()) {
    postActionError.value = 'Please enter post content'
    return
  }
  
  if (editPostBody.value.trim().length < 3 || editPostBody.value.trim().length > 100) {
    postActionError.value = 'Body must be between 3 and 100 characters'
    return
  }
  
  isUpdatingPost.value = true

  try {
    await updatePost(postId, {
      title: editPostTitle.value.trim(),
      body: editPostBody.value.trim(),
      visibility: editPostVisibility.value
    })
    
    postActionSuccess.value = 'Post updated successfully!'
    
    // Clear edit mode
    editingPostId.value = null
    editPostTitle.value = ''
    editPostBody.value = ''
    editPostVisibility.value = 'PUBLIC'
    
    // Refresh posts list
    await fetchUserPosts()
    
    setTimeout(() => {
      postActionSuccess.value = ''
    }, 3000)
  } catch (error) {
    if (error.response?.data?.message) {
      postActionError.value = error.response.data.message
    } else if (error.response?.status === 401) {
      postActionError.value = 'You must be logged in to update posts'
    } else if (error.response?.status === 403) {
      postActionError.value = 'You can only update your own posts'
    } else if (error.message) {
      postActionError.value = error.message
    } else {
      postActionError.value = 'Failed to update post. Please try again.'
    }
  } finally {
    isUpdatingPost.value = false
  }
}

// Delete post
const handleDeletePost = async (postId) => {
  if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
    return
  }
  
  postActionError.value = ''
  postActionSuccess.value = ''
  isDeletingPostId.value = postId

  try {
    await deletePost(postId)
    
    postActionSuccess.value = 'Post deleted successfully!'
    
    // Refresh posts list
    await fetchUserPosts()
    
    setTimeout(() => {
      postActionSuccess.value = ''
    }, 3000)
  } catch (error) {
    if (error.response?.data?.message) {
      postActionError.value = error.response.data.message
    } else if (error.response?.status === 401) {
      postActionError.value = 'You must be logged in to delete posts'
    } else if (error.response?.status === 403) {
      postActionError.value = 'You can only delete your own posts'
    } else if (error.message) {
      postActionError.value = error.message
    } else {
      postActionError.value = 'Failed to delete post. Please try again.'
    }
  } finally {
    isDeletingPostId.value = null
  }
}
</script>

<template>
  <main class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <!-- Desktop Layout -->
    <div class="hidden lg:block w-full min-h-screen">
      <div class="px-8 py-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
        <!-- Page Header -->
        <div class="mb-12">
          <h1 class="text-5xl font-bold text-emerald-500 mb-3">Profile Overview</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Create new posts and manage your content
          </p>
        </div>

        <div class="space-y-6">
          <!-- Create Post Card -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 shadow-lg hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300"
          >
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-emerald-500 mb-2 flex items-center gap-2">
                <span class="text-3xl">✍️</span>
                Create Post
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Share your thoughts with the community
              </p>
            </div>

            <!-- Success/Error Messages -->
            <div v-if="successMessage" class="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-start gap-3">
              <span class="text-xl">✓</span>
              <span>{{ successMessage }}</span>
            </div>

            <ErrorDisplayComponent :message="errorMessage" class="mb-6" />

            <form @submit.prevent="createPost" class="space-y-6">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium mb-2 text-emerald-500">
                  Title
                </label>
                <input
                  v-model="postTitle"
                  type="text"
                  placeholder="Enter post title..."
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 hover:border-emerald-400"
                />
              </div>

              <!-- Body -->
              <div>
                <label class="block text-sm font-medium mb-2 text-emerald-500">
                  Body
                </label>
                <textarea
                  v-model="postBody"
                  rows="8"
                  placeholder="Write your post content..."
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 hover:border-emerald-400 resize-vertical"
                ></textarea>
              </div>

              <!-- Visibility -->
              <div>
                <label class="block text-sm font-medium mb-2 text-emerald-500">
                  Visibility
                </label>
                <select
                  v-model="postVisibility"
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 hover:border-emerald-400"
                >
                  <option value="PUBLIC">🌍 Public</option>
                  <option value="PRIVATE">🔒 Private</option>
                </select>
              </div>

              <!-- Group (Optional) -->
              <div>
                <label class="block text-sm font-medium mb-2 text-emerald-500">
                  Group (Optional)
                </label>
                <select
                  v-model="selectedGroupId"
                  :disabled="isLoadingAvailableGroups"
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 hover:border-emerald-400"
                >
                  <option value="">📝 None (Personal post)</option>
                  <option v-for="group in availableGroups" :key="group.id" :value="group.id">
                    👫 {{ group.name }}
                  </option>
                </select>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-4 pt-4">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="flex-1 px-6 py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="!isLoading">📤 Create Post</span>
                  <span v-else>Creating...</span>
                </button>
                <button
                  type="button"
                  @click="postTitle = ''; postBody = ''; postVisibility = 'PUBLIC'; selectedGroupId = ''"
                  class="px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all font-medium"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          <!-- Create Group Card -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 shadow-lg hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300"
          >
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-emerald-500 mb-2 flex items-center gap-2">
                <span class="text-3xl">👫</span>
                Create Group
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Start a new community group
              </p>
            </div>

            <!-- Success/Error Messages -->
            <div v-if="groupSuccessMessage" class="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-start gap-3">
              <span class="text-xl">✓</span>
              <span>{{ groupSuccessMessage }}</span>
            </div>

            <ErrorDisplayComponent :message="groupErrorMessage" class="mb-6" />

            <form @submit.prevent="createGroup" class="space-y-6">
              <!-- Group Name -->
              <div>
                <label class="block text-sm font-medium mb-2 text-emerald-500">
                  Group Name
                </label>
                <input
                  v-model="groupName"
                  type="text"
                  placeholder="Enter group name..."
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 hover:border-emerald-400"
                />
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-4 pt-4">
                <button
                  type="submit"
                  :disabled="isLoadingGroup"
                  class="flex-1 px-6 py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="!isLoadingGroup">👫 Create Group</span>
                  <span v-else>Creating...</span>
                </button>
                <button
                  type="button"
                  @click="groupName = ''"
                  class="px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all font-medium"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          <!-- My Posts Section -->
          <div class="mt-12">
            <h2 class="text-3xl font-bold text-emerald-500 mb-6 flex items-center gap-2">
              <span class="text-4xl">📋</span>
              My Posts
            </h2>

            <!-- Loading State -->
            <div v-if="isLoadingPosts" class="text-center py-12">
              <p class="text-gray-600 dark:text-gray-400">Loading your posts...</p>
            </div>

            <!-- Error State -->
            <ErrorDisplayComponent :message="postsErrorMessage" class="mb-6" />

            <!-- Empty State -->
            <div v-if="!isLoadingPosts && !postsErrorMessage && userPosts.length === 0" 
              class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-12 text-center shadow-lg">
              <span class="text-6xl mb-4 block">📝</span>
              <p class="text-xl text-gray-600 dark:text-gray-400 mb-2">No posts yet</p>
              <p class="text-sm text-gray-500 dark:text-gray-500">Create your first post above to get started!</p>
            </div>

            <!-- Post Action Messages -->
            <div v-if="postActionSuccess" class="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-start gap-3">
              <span class="text-xl">✓</span>
              <span>{{ postActionSuccess }}</span>
            </div>
            <ErrorDisplayComponent :message="postActionError" class="mb-6" />

            <!-- Posts List -->
            <div v-if="!isLoadingPosts && userPosts.length > 0" class="space-y-6">
              <div v-for="post in userPosts" :key="post.id">
                <!-- Edit Mode -->
                <div v-if="editingPostId === post.id" class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg">
                  <h3 class="text-lg font-bold text-emerald-500 mb-4">Edit Post</h3>
                  <form @submit.prevent="handleUpdatePost(post.id)" class="space-y-4">
                    <!-- Title -->
                    <div>
                      <label class="block text-sm font-medium mb-2 text-emerald-500">
                        Title
                      </label>
                      <input
                        v-model="editPostTitle"
                        type="text"
                        placeholder="Enter post title..."
                        class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
                      />
                    </div>

                    <!-- Body -->
                    <div>
                      <label class="block text-sm font-medium mb-2 text-emerald-500">
                        Body
                      </label>
                      <textarea
                        v-model="editPostBody"
                        rows="6"
                        placeholder="Write your post content..."
                        class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all resize-vertical"
                      ></textarea>
                    </div>

                    <!-- Visibility -->
                    <div>
                      <label class="block text-sm font-medium mb-2 text-emerald-500">
                        Visibility
                      </label>
                      <select
                        v-model="editPostVisibility"
                        class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
                      >
                        <option value="PUBLIC">🌍 Public</option>
                        <option value="PRIVATE">🔒 Private</option>
                      </select>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-3 pt-2">
                      <button
                        type="submit"
                        :disabled="isUpdatingPost"
                        class="flex-1 px-4 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50"
                      >
                        <span v-if="!isUpdatingPost">💾 Save Changes</span>
                        <span v-else>Saving...</span>
                      </button>
                      <button
                        type="button"
                        @click="cancelEditPost"
                        class="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-emerald-400 transition-all font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>

                <!-- View Mode -->
                <div v-else class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg">
                  <PostPreviewCard
                    :post="post"
                    variant="main"
                  />
                  
                  <!-- Action Buttons -->
                  <div class="flex gap-2 mt-4">
                    <button
                      @click="startEditPost(post)"
                      class="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 active:scale-95 transition-all"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      @click="handleDeletePost(post.id)"
                      :disabled="isDeletingPostId === post.id"
                      class="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50"
                    >
                      <span v-if="isDeletingPostId === post.id">Deleting...</span>
                      <span v-else>🗑️ Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- My Groups Section -->
          <div class="mt-12">
            <h2 class="text-3xl font-bold text-emerald-500 mb-6 flex items-center gap-2">
              <span class="text-4xl">👫</span>
              My Groups
            </h2>

            <!-- Loading State -->
            <div v-if="isLoadingGroups" class="text-center py-12">
              <p class="text-gray-600 dark:text-gray-400">Loading your groups...</p>
            </div>

            <!-- Error State -->
            <ErrorDisplayComponent :message="groupsErrorMessage" class="mb-6" />

            <!-- Member Management Messages (Admin only) -->
            <div v-if="isAdmin">
              <div v-if="memberSuccessMessage" class="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-start gap-3">
                <span class="text-xl">✓</span>
                <span>{{ memberSuccessMessage }}</span>
              </div>
              <ErrorDisplayComponent :message="memberErrorMessage" class="mb-6" />
            </div>

            <!-- Empty State -->
            <div v-if="!isLoadingGroups && !groupsErrorMessage && userGroups.length === 0" 
              class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-12 text-center shadow-lg">
              <span class="text-6xl mb-4 block">👫</span>
              <p class="text-xl text-gray-600 dark:text-gray-400 mb-2">No groups yet</p>
              <p class="text-sm text-gray-500 dark:text-gray-500">Create your first group above to get started!</p>
            </div>

            <!-- Groups List -->
            <div v-if="!isLoadingGroups && userGroups.length > 0" class="space-y-6">
              <div v-for="group in userGroups" :key="group.id" class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg">
                <GroupPreviewCard
                  :group="group"
                  variant="main"
                />
                
                <!-- Add Member UI (Admin only) -->
                <div v-if="isAdmin" class="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-3">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Add Member:</span>
                    <select
                      v-model="selectedUserIds[group.id]"
                      class="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 transition-all text-sm"
                      :disabled="isLoadingUsers || addingMemberToGroupId === group.id"
                    >
                      <option value="">Select a user...</option>
                      <option v-for="user in allUsers" :key="user.id" :value="user.id">
                        {{ user.username }} ({{ user.email }})
                      </option>
                    </select>
                    <button
                      @click="handleAddMember(group.id)"
                      :disabled="!selectedUserIds[group.id] || addingMemberToGroupId === group.id"
                      class="px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm"
                    >
                      <span v-if="addingMemberToGroupId === group.id">Adding...</span>
                      <span v-else>➕ Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- My Memberships Section -->
          <div class="mt-12">
            <h2 class="text-3xl font-bold text-emerald-500 mb-6 flex items-center gap-2">
              <span class="text-4xl">👥</span>
              My Memberships
            </h2>

            <!-- Loading State -->
            <div v-if="isLoadingUserMemberships" class="text-center py-12">
              <p class="text-gray-600 dark:text-gray-400">Loading your memberships...</p>
            </div>

            <!-- Error State -->
            <ErrorDisplayComponent :message="userMembershipsErrorMessage" class="mb-6" />

            <!-- Empty State -->
            <div v-if="!isLoadingUserMemberships && !userMembershipsErrorMessage && userGroupMemberships.length === 0" 
              class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-12 text-center shadow-lg">
              <span class="text-6xl mb-4 block">👥</span>
              <p class="text-xl text-gray-600 dark:text-gray-400 mb-2">No memberships yet</p>
              <p class="text-sm text-gray-500 dark:text-gray-500">Join or create a group to get started!</p>
            </div>

            <!-- Memberships List -->
            <div v-if="!isLoadingUserMemberships && userGroupMemberships.length > 0" class="space-y-6">
              <div
                v-for="group in userGroupMemberships"
                :key="group.id"
                class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg"
              >
                <GroupPreviewCard
                  :group="group"
                  variant="main"
                />
              </div>
            </div>
          </div>

          <!-- Group Memberships Overview (Admin only) -->
          <div v-if="isAdmin" class="mt-12">
            <h2 class="text-3xl font-bold text-emerald-500 mb-6 flex items-center gap-2">
              <span class="text-4xl">🛡️</span>
              Group Memberships Overview
            </h2>

            <!-- Loading State -->
            <div v-if="isLoadingMemberships" class="text-center py-12">
              <p class="text-gray-600 dark:text-gray-400">Loading memberships...</p>
            </div>

            <!-- Error State -->
            <ErrorDisplayComponent :message="membershipsErrorMessage" class="mb-6" />

            <!-- Empty State -->
            <div v-if="!isLoadingMemberships && !membershipsErrorMessage && groupMemberships.length === 0" 
              class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-12 text-center shadow-lg">
              <span class="text-6xl mb-4 block">📊</span>
              <p class="text-xl text-gray-600 dark:text-gray-400 mb-2">No memberships yet</p>
              <p class="text-sm text-gray-500 dark:text-gray-500">Add members to groups to see them here</p>
            </div>

            <!-- Memberships Table -->
            <div v-if="!isLoadingMemberships && groupMemberships.length > 0" 
              class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-emerald-50 dark:bg-emerald-900/20 border-b-2 border-emerald-200 dark:border-emerald-800">
                    <tr>
                      <th class="px-6 py-4 text-left text-sm font-semibold text-emerald-600 dark:text-emerald-400">User</th>
                      <th class="px-6 py-4 text-left text-sm font-semibold text-emerald-600 dark:text-emerald-400">Group</th>
                      <th class="px-6 py-4 text-left text-sm font-semibold text-emerald-600 dark:text-emerald-400">Role</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="membership in groupMemberships" :key="`${membership.userId}-${membership.groupId}`"
                      class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {{ membership.username || membership.userId }}
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {{ membership.groupName || membership.groupId }}
                      </td>
                      <td class="px-6 py-4 text-sm">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                          {{ membership.role || 'MEMBER' }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Layout -->
    <div class="lg:hidden p-6 pb-24">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-emerald-500 mb-2">Profile Overview</h1>
        <p class="text-base text-gray-600 dark:text-gray-400">
          Create new posts and manage your content
        </p>
      </div>

      <div class="space-y-6">
        <!-- Create Post Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg"
        >
          <div class="mb-6">
            <h2 class="text-xl font-bold text-emerald-500 mb-2 flex items-center gap-2">
              <span class="text-2xl">✍️</span>
              Create Post
            </h2>
          </div>

          <!-- Success/Error Messages -->
          <div v-if="successMessage" class="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-start gap-2 text-sm">
            <span>✓</span>
            <span>{{ successMessage }}</span>
          </div>

          <ErrorDisplayComponent :message="errorMessage" class="mb-4" />

          <form @submit.prevent="createPost" class="space-y-4">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium mb-2 text-emerald-500">
                Title
              </label>
              <input
                v-model="postTitle"
                type="text"
                placeholder="Enter post title..."
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
              />
            </div>

            <!-- Body -->
            <div>
              <label class="block text-sm font-medium mb-2 text-emerald-500">
                Body
              </label>
              <textarea
                v-model="postBody"
                rows="6"
                placeholder="Write your post content..."
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all resize-vertical"
              ></textarea>
            </div>

            <!-- Visibility -->
            <div>
              <label class="block text-sm font-medium mb-2 text-emerald-500">
                Visibility
              </label>
              <select
                v-model="postVisibility"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
              >
                <option value="PUBLIC">🌍 Public</option>
                <option value="PRIVATE">🔒 Private</option>
              </select>
            </div>

            <!-- Group (Optional) -->
            <div>
              <label class="block text-sm font-medium mb-2 text-emerald-500">
                Group (Optional)
              </label>
              <select
                v-model="selectedGroupId"
                :disabled="isLoadingAvailableGroups"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
              >
                <option value="">📝 None (Personal post)</option>
                <option v-for="group in availableGroups" :key="group.id" :value="group.id">
                  👫 {{ group.name }}
                </option>
              </select>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full px-6 py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50"
              >
                <span v-if="!isLoading">📤 Create Post</span>
                <span v-else>Creating...</span>
              </button>
              <button
                type="button"
                @click="postTitle = ''; postBody = ''; postVisibility = 'PUBLIC'; selectedGroupId = ''"
                class="w-full px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-emerald-400 transition-all font-medium"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        <!-- Create Group Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg"
        >
          <div class="mb-6">
            <h2 class="text-xl font-bold text-emerald-500 mb-2 flex items-center gap-2">
              <span class="text-2xl">👫</span>
              Create Group
            </h2>
          </div>

          <!-- Success/Error Messages -->
          <div v-if="groupSuccessMessage" class="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-start gap-2 text-sm">
            <span>✓</span>
            <span>{{ groupSuccessMessage }}</span>
          </div>

          <ErrorDisplayComponent :message="groupErrorMessage" class="mb-4" />

          <form @submit.prevent="createGroup" class="space-y-4">
            <!-- Group Name -->
            <div>
              <label class="block text-sm font-medium mb-2 text-emerald-500">
                Group Name
              </label>
              <input
                v-model="groupName"
                type="text"
                placeholder="Enter group name..."
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
              />
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                :disabled="isLoadingGroup"
                class="w-full px-6 py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50"
              >
                <span v-if="!isLoadingGroup">👫 Create Group</span>
                <span v-else>Creating...</span>
              </button>
              <button
                type="button"
                @click="groupName = ''"
                class="w-full px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-emerald-400 transition-all font-medium"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        <!-- My Posts Section -->
        <div class="mt-12">
          <h2 class="text-2xl font-bold text-emerald-500 mb-6 flex items-center gap-2">
            <span class="text-3xl">📋</span>
            My Posts
          </h2>

          <!-- Loading State -->
          <div v-if="isLoadingPosts" class="text-center py-8">
            <p class="text-gray-600 dark:text-gray-400">Loading your posts...</p>
          </div>

          <!-- Error State -->
          <ErrorDisplayComponent :message="postsErrorMessage" class="mb-4" />

          <!-- Post Action Messages -->
          <div v-if="postActionSuccess" class="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-start gap-2 text-sm">
            <span>✓</span>
            <span>{{ postActionSuccess }}</span>
          </div>
          <ErrorDisplayComponent :message="postActionError" class="mb-4" />

          <!-- Empty State -->
          <div v-if="!isLoadingPosts && !postsErrorMessage && userPosts.length === 0" 
            class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 text-center shadow-lg">
            <span class="text-5xl mb-3 block">📝</span>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-2">No posts yet</p>
            <p class="text-sm text-gray-500 dark:text-gray-500">Create your first post above to get started!</p>
          </div>

          <!-- Posts List -->
          <div v-if="!isLoadingPosts && userPosts.length > 0" class="space-y-6">
            <div v-for="post in userPosts" :key="post.id">
              <!-- Edit Mode -->
              <div v-if="editingPostId === post.id" class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg">
                <h3 class="text-base font-bold text-emerald-500 mb-4">Edit Post</h3>
                <form @submit.prevent="handleUpdatePost(post.id)" class="space-y-4">
                  <!-- Title -->
                  <div>
                    <label class="block text-sm font-medium mb-2 text-emerald-500">
                      Title
                    </label>
                    <input
                      v-model="editPostTitle"
                      type="text"
                      placeholder="Enter post title..."
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
                    />
                  </div>

                  <!-- Body -->
                  <div>
                    <label class="block text-sm font-medium mb-2 text-emerald-500">
                      Body
                    </label>
                    <textarea
                      v-model="editPostBody"
                      rows="5"
                      placeholder="Write your post content..."
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all resize-vertical"
                    ></textarea>
                  </div>

                  <!-- Visibility -->
                  <div>
                    <label class="block text-sm font-medium mb-2 text-emerald-500">
                      Visibility
                    </label>
                    <select
                      v-model="editPostVisibility"
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
                    >
                      <option value="PUBLIC">🌍 Public</option>
                      <option value="PRIVATE">🔒 Private</option>
                    </select>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex flex-col gap-2 pt-2">
                    <button
                      type="submit"
                      :disabled="isUpdatingPost"
                      class="w-full px-4 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50 text-sm"
                    >
                      <span v-if="!isUpdatingPost">💾 Save Changes</span>
                      <span v-else>Saving...</span>
                    </button>
                    <button
                      type="button"
                      @click="cancelEditPost"
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-emerald-400 transition-all font-medium text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>

              <!-- View Mode -->
              <div v-else class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg">
                <PostPreviewCard
                  :post="post"
                  variant="mobile"
                />
                
                <!-- Action Buttons -->
                <div class="flex gap-2 mt-4">
                  <button
                    @click="startEditPost(post)"
                    class="flex-1 px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 active:scale-95 transition-all"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    @click="handleDeletePost(post.id)"
                    :disabled="isDeletingPostId === post.id"
                    class="flex-1 px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <span v-if="isDeletingPostId === post.id">Deleting...</span>
                    <span v-else>🗑️ Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- My Groups Section -->
        <div class="mt-12">
          <h2 class="text-2xl font-bold text-emerald-500 mb-6 flex items-center gap-2">
            <span class="text-3xl">👫</span>
            My Groups
          </h2>

          <!-- Loading State -->
          <div v-if="isLoadingGroups" class="text-center py-8">
            <p class="text-gray-600 dark:text-gray-400">Loading your groups...</p>
          </div>

          <!-- Error State -->
          <ErrorDisplayComponent :message="groupsErrorMessage" class="mb-4" />

          <!-- Member Management Messages (Admin only) -->
          <div v-if="isAdmin">
            <div v-if="memberSuccessMessage" class="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-start gap-2 text-sm">
              <span>✓</span>
              <span>{{ memberSuccessMessage }}</span>
            </div>
            <ErrorDisplayComponent :message="memberErrorMessage" class="mb-4" />
          </div>

          <!-- Empty State -->
          <div v-if="!isLoadingGroups && !groupsErrorMessage && userGroups.length === 0" 
            class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 text-center shadow-lg">
            <span class="text-5xl mb-3 block">👫</span>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-2">No groups yet</p>
            <p class="text-sm text-gray-500 dark:text-gray-500">Create your first group above to get started!</p>
          </div>

          <!-- Groups List -->
          <div v-if="!isLoadingGroups && userGroups.length > 0" class="space-y-6">
            <div v-for="group in userGroups" :key="group.id" class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg">
              <GroupPreviewCard
                :group="group"
                variant="mobile"
              />
              
              <!-- Add Member UI (Admin only) -->
              <div v-if="isAdmin" class="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                <div class="space-y-3">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Add Member:</label>
                  <select
                    v-model="selectedUserIds[group.id]"
                    class="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 transition-all text-sm"
                    :disabled="isLoadingUsers || addingMemberToGroupId === group.id"
                  >
                    <option value="">Select a user...</option>
                    <option v-for="user in allUsers" :key="user.id" :value="user.id">
                      {{ user.username }} ({{ user.email }})
                    </option>
                  </select>
                  <button
                    @click="handleAddMember(group.id)"
                    :disabled="!selectedUserIds[group.id] || addingMemberToGroupId === group.id"
                    class="w-full px-4 py-3 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <span v-if="addingMemberToGroupId === group.id">Adding...</span>
                    <span v-else>➕ Add Member</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- My Memberships Section -->
        <div class="mt-12">
          <h2 class="text-2xl font-bold text-emerald-500 mb-6 flex items-center gap-2">
            <span class="text-3xl">👥</span>
            My Memberships
          </h2>

          <!-- Loading State -->
          <div v-if="isLoadingUserMemberships" class="text-center py-8">
            <p class="text-gray-600 dark:text-gray-400">Loading your memberships...</p>
          </div>

          <!-- Error State -->
          <ErrorDisplayComponent :message="userMembershipsErrorMessage" class="mb-4" />

          <!-- Empty State -->
          <div v-if="!isLoadingUserMemberships && !userMembershipsErrorMessage && userGroupMemberships.length === 0" 
            class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 text-center shadow-lg">
            <span class="text-5xl mb-3 block">👥</span>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-2">No memberships yet</p>
            <p class="text-sm text-gray-500 dark:text-gray-500">Join or create a group to get started!</p>
          </div>

          <!-- Memberships List -->
          <div v-if="!isLoadingUserMemberships && userGroupMemberships.length > 0" class="space-y-6">
            <div
              v-for="group in userGroupMemberships"
              :key="group.id"
              class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg"
            >
              <GroupPreviewCard
                :group="group"
                variant="mobile"
              />
            </div>
          </div>
        </div>

        <!-- Group Memberships Overview (Admin only) -->
        <div v-if="isAdmin" class="mt-12">
          <h2 class="text-2xl font-bold text-emerald-500 mb-6 flex items-center gap-2">
            <span class="text-3xl">🛡️</span>
            Group Memberships Overview
          </h2>

          <!-- Loading State -->
          <div v-if="isLoadingMemberships" class="text-center py-8">
            <p class="text-gray-600 dark:text-gray-400">Loading memberships...</p>
          </div>

          <!-- Error State -->
          <ErrorDisplayComponent :message="membershipsErrorMessage" class="mb-4" />

          <!-- Empty State -->
          <div v-if="!isLoadingMemberships && !membershipsErrorMessage && groupMemberships.length === 0" 
            class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 text-center shadow-lg">
            <span class="text-5xl mb-3 block">📊</span>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-2">No memberships yet</p>
            <p class="text-sm text-gray-500 dark:text-gray-500">Add members to groups to see them here</p>
          </div>

          <!-- Memberships List (Card style for mobile) -->
          <div v-if="!isLoadingMemberships && groupMemberships.length > 0" class="space-y-3">
            <div v-for="membership in groupMemberships" :key="`${membership.userId}-${membership.groupId}`"
              class="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-4 shadow-md">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">User</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ membership.username || membership.userId }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Group</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ membership.groupName || membership.groupId }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Role</span>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                    {{ membership.role || 'MEMBER' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
