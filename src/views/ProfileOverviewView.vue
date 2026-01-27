<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { apiClient, fetchAllUsers, addGroupMember, fetchGroupMemberships, createGroup as createGroupApi, updatePost, deletePost, fetchAllGroups, createGroupPost, updateGroupPost, deleteGroupPost, updateGroup, deleteGroup } from '@/config/api'
import ErrorDisplayComponent from '@/components/ErrorDisplayComponent.vue'
import PostPreviewCard from '@/components/PostPreviewCard.vue'
import GroupPreviewCard from '@/components/GroupPreviewCard.vue'
import SuccessMessage from '@/components/SuccessMessage.vue'
import LoadingState from '@/components/LoadingState.vue'
import EmptyState from '@/components/EmptyState.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import FormCard from '@/components/FormCard.vue'
import PostEditForm from '@/components/PostEditForm.vue'
import PostActionsCard from '@/components/PostActionsCard.vue'
import GroupChangeUI from '@/components/GroupChangeUI.vue'
import AddMemberSection from '@/components/AddMemberSection.vue'

const auth = useAuthStore()

const isAdmin = computed(() => auth.role === 'ADMIN')

const postTitle = ref('')
const postBody = ref('')
const postVisibility = ref('PUBLIC')
const selectedGroupId = ref('')

const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const availableGroups = ref([])
const isLoadingAvailableGroups = ref(false)

const userPosts = ref([])
const isLoadingPosts = ref(false)
const postsErrorMessage = ref('')

const groupName = ref('')
const groupEmoji = ref('')
const groupDescription = ref('')

const groupErrorMessage = ref('')
const groupSuccessMessage = ref('')
const isLoadingGroup = ref(false)

const userGroups = ref([])
const isLoadingGroups = ref(false)
const groupsErrorMessage = ref('')

const allUsers = ref([])
const isLoadingUsers = ref(false)
const usersErrorMessage = ref('')

const selectedUserIds = ref({})

const addingMemberToGroupId = ref(null)
const memberSuccessMessage = ref('')
const memberErrorMessage = ref('')

const groupMemberships = ref([])
const isLoadingMemberships = ref(false)
const membershipsErrorMessage = ref('')

const userGroupMemberships = ref([])
const isLoadingUserMemberships = ref(false)
const userMembershipsErrorMessage = ref('')

const editingPostId = ref(null)
const editPostTitle = ref('')
const editPostBody = ref('')
const editPostVisibility = ref('PUBLIC')
const isUpdatingPost = ref(false)
const isDeletingPostId = ref(null)
const postActionError = ref('')
const postActionSuccess = ref('')

const changingGroupForPostId = ref(null)
const newGroupIdForPost = ref('')
const isChangingPostGroup = ref(false)
const allGroupPosts = ref([])
const isLoadingGroupPosts = ref(false)

// Group management state
const editingGroupId = ref(null)
const editGroupName = ref('')
const editGroupEmoji = ref('')
const editGroupDescription = ref('')
const isUpdatingGroup = ref(false)
const isDeletingGroupId = ref(null)
const groupActionError = ref('')
const groupActionSuccess = ref('')
const viewingMembersForGroupId = ref(null)

const fetchUserPosts = async () => {
  isLoadingPosts.value = true
  postsErrorMessage.value = ''
  
  try {
    const response = await apiClient.get('/posts/my-posts')
    
    // Fetch groups and group posts if not already loaded
    let groupsData = availableGroups.value
    let groupPostsData = allGroupPosts.value
    
    if (groupsData.length === 0) {
      try {
        const groupsResponse = await fetchAllGroups()
        groupsData = groupsResponse.data
        availableGroups.value = groupsData
      } catch (err) {
        console.error('[ProfileOverview] Error fetching groups for emojis:', err)
      }
    }
    
    if (groupPostsData.length === 0) {
      try {
        const groupPostsResponse = await apiClient.get('/groupposts')
        groupPostsData = groupPostsResponse.data.map(gp => ({
          ...gp,
          sharedBy: gp.username,
          sharedById: gp.userId
        }))
        allGroupPosts.value = groupPostsData
      } catch (err) {
        console.error('[ProfileOverview] Error fetching group posts for emojis:', err)
      }
    }
    
    // Create emoji map from groups
    const groupsEmojiMap = groupsData.reduce((map, group) => {
      map[group.id] = group.emoji || '👥'
      return map
    }, {})
    
    userPosts.value = response.data.map(post => {
      const groupPost = groupPostsData.find(gp => gp.postId === post.id)
      const groupEmoji = groupPost && groupsEmojiMap[groupPost.groupId] ? groupsEmojiMap[groupPost.groupId] : '💬'
      
      return {
        id: post.id,
        title: post.title,
        content: post.body,
        icon: groupEmoji
      }
    })
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

const fetchUserGroups = async () => {
  isLoadingGroups.value = true
  groupsErrorMessage.value = ''
  
  try {
    console.log('[ProfileOverview] Fetching user groups from /groups/my-groups...')
    const response = await apiClient.get('/groups/my-groups')
    console.log('[ProfileOverview] Received groups:', response.data)
    
    userGroups.value = response.data.map(group => ({
      id: group.id,
      name: group.name,
      emoji: group.emoji || '👥',
      description: group.description || `Created by ${group.createdByUsername || 'Unknown'}`,
      createdByUsername: group.createdByUsername
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

const fetchUserGroupMemberships = async () => {
  isLoadingUserMemberships.value = true
  userMembershipsErrorMessage.value = ''
  
  try {
    const response = await apiClient.get('/groups/my-groups')
    
    userGroupMemberships.value = response.data.map(group => ({
      id: group.id,
      name: group.name,
      emoji: group.emoji || '👥',
      description: group.description || `Created by ${group.createdByUsername || 'Unknown'}`,
      createdByUsername: group.createdByUsername
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

const fetchAvailableGroups = async () => {
  isLoadingAvailableGroups.value = true
  
  try {
    const response = await fetchAllGroups()
    availableGroups.value = response.data
  } catch (error) {
    console.error('[ProfileOverview] Error fetching available groups:', error)
  } finally {
    isLoadingAvailableGroups.value = false
  }
}

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
    
    selectedUserIds.value[groupId] = ''
    
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

onMounted(() => {
  fetchUserPosts()
  fetchUserGroups()
  fetchUserGroupMemberships()
  fetchAvailableGroups()
  fetchAllGroupPosts()
  
  if (isAdmin.value) {
    fetchUsers()
    fetchMemberships()
  }
})

const createPost = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
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
    const response = await apiClient.post('/posts', {
      title: postTitle.value.trim(),
      body: postBody.value.trim(),
      visibility: postVisibility.value
    })
    
    const createdPostId = response.data.id
    
    if (selectedGroupId.value) {
      try {
        await createGroupPost(selectedGroupId.value, { postId: createdPostId })
        
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
    
    postTitle.value = ''
    postBody.value = ''
    postVisibility.value = 'PUBLIC'
    selectedGroupId.value = ''
    
    await fetchUserPosts()
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
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

const createGroup = async () => {
  groupErrorMessage.value = ''
  groupSuccessMessage.value = ''
  
  if (!groupName.value.trim()) {
    groupErrorMessage.value = 'Please enter a group name'
    return
  }
  
  if (groupName.value.trim().length < 5 || groupName.value.trim().length > 15) {
    groupErrorMessage.value = 'Group name must be between 5 and 15 characters'
    return
  }
  
  if (groupEmoji.value.trim() && groupEmoji.value.trim().length > 10) {
    groupErrorMessage.value = 'Emoji must be 10 characters or less'
    return
  }
  
  if (groupDescription.value.trim() && groupDescription.value.trim().length > 500) {
    groupErrorMessage.value = 'Description must be 500 characters or less'
    return
  }
  
  isLoadingGroup.value = true
  const groupNameToCreate = groupName.value.trim()
  const emojiToCreate = groupEmoji.value.trim() || undefined
  const descriptionToCreate = groupDescription.value.trim() || undefined

  try {
    console.log('[ProfileOverview] Creating group with name:', groupNameToCreate, 'emoji:', emojiToCreate, 'description:', descriptionToCreate)
    const response = await createGroupApi(groupNameToCreate, emojiToCreate, descriptionToCreate)
    console.log('[ProfileOverview] Group created successfully:', response.data)
    
    groupSuccessMessage.value = 'Group created successfully!'
    
    groupName.value = ''
    groupEmoji.value = ''
    groupDescription.value = ''
    
    const groupsCountBefore = userGroups.value.length
    console.log('[ProfileOverview] Groups count before refresh:', groupsCountBefore)
    
    await fetchUserGroups()
    
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

const startEditPost = (post) => {
  editingPostId.value = post.id
  editPostTitle.value = post.title
  editPostBody.value = post.content
  editPostVisibility.value = post.visibility || 'PUBLIC'
  postActionError.value = ''
  postActionSuccess.value = ''
}

const cancelEditPost = () => {
  editingPostId.value = null
  editPostTitle.value = ''
  editPostBody.value = ''
  editPostVisibility.value = 'PUBLIC'
  postActionError.value = ''
}

const handleUpdatePost = async (data) => {
  const { postId, title, body, visibility } = data
  postActionError.value = ''
  postActionSuccess.value = ''
  
  if (!title.trim()) {
    postActionError.value = 'Please enter a title'
    return
  }
  
  if (title.trim().length < 3 || title.trim().length > 30) {
    postActionError.value = 'Title must be between 3 and 30 characters'
    return
  }
  
  if (!body.trim()) {
    postActionError.value = 'Please enter post content'
    return
  }
  
  if (body.trim().length < 3 || body.trim().length > 100) {
    postActionError.value = 'Body must be between 3 and 100 characters'
    return
  }
  
  isUpdatingPost.value = true

  try {
    await updatePost(postId, {
      title: title.trim(),
      body: body.trim(),
      visibility: visibility
    })
    
    postActionSuccess.value = 'Post updated successfully!'
    
    editingPostId.value = null
    editPostTitle.value = ''
    editPostBody.value = ''
    editPostVisibility.value = 'PUBLIC'
    
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

const fetchAllGroupPosts = async () => {
  isLoadingGroupPosts.value = true
  
  try {
    const response = await apiClient.get('/groupposts')
    allGroupPosts.value = response.data.map(gp => ({
      ...gp,
      sharedBy: gp.username,
      sharedById: gp.userId
    }))
  } catch (error) {
    console.error('[ProfileOverview] Error fetching group posts:', error)
  } finally {
    isLoadingGroupPosts.value = false
  }
}

const getGroupPostForPost = (postId) => {
  return allGroupPosts.value.find(gp => gp.postId === postId)
}

const getCurrentGroupForPost = (postId) => {
  const groupPost = getGroupPostForPost(postId)
  return groupPost ? groupPost.groupId : null
}

const getCurrentGroupNameForPost = (postId) => {
  const groupId = getCurrentGroupForPost(postId)
  if (!groupId) return null
  const group = availableGroups.value.find(g => g.id === groupId)
  return group ? group.name : 'Unknown Group'
}

const startChangeGroup = (postId) => {
  changingGroupForPostId.value = postId
  newGroupIdForPost.value = getCurrentGroupForPost(postId) || ''
  postActionError.value = ''
  postActionSuccess.value = ''
}

const cancelChangeGroup = () => {
  changingGroupForPostId.value = null
  newGroupIdForPost.value = ''
  postActionError.value = ''
}

const handleChangePostGroup = async (postId) => {
  postActionError.value = ''
  postActionSuccess.value = ''
  isChangingPostGroup.value = true

  try {
    const currentGroupPost = getGroupPostForPost(postId)
    
    // Case 1: Post is currently in a group
    if (currentGroupPost) {
      // If selecting a new group, UPDATE the group post
      if (newGroupIdForPost.value) {
        await updateGroupPost(currentGroupPost.id, {
          groupId: newGroupIdForPost.value,
          postId: postId
        })
        
        const selectedGroup = availableGroups.value.find(g => g.id === newGroupIdForPost.value)
        const groupName = selectedGroup ? selectedGroup.name : 'group'
        
        postActionSuccess.value = `Post group updated to ${groupName}!`
      } else {
        // If no group selected, DELETE the group post (remove from all groups)
        await deleteGroupPost(currentGroupPost.id)
        postActionSuccess.value = 'Post removed from all groups!'
      }
    } 
    // Case 2: Post is not currently in any group
    else {
      // If selecting a group, CREATE a new group post
      if (newGroupIdForPost.value) {
        await createGroupPost(newGroupIdForPost.value, { postId })
        
        const selectedGroup = availableGroups.value.find(g => g.id === newGroupIdForPost.value)
        const groupName = selectedGroup ? selectedGroup.name : 'group'
        
        postActionSuccess.value = `Post added to ${groupName}!`
      } else {
        // No-op: post wasn't in a group and still isn't
        postActionSuccess.value = 'No changes made'
      }
    }
    
    changingGroupForPostId.value = null
    newGroupIdForPost.value = ''
    
    await fetchAllGroupPosts()
    
    // Update the post's emoji after group change
    const post = userPosts.value.find(p => p.id === postId)
    if (post) {
      const groupPost = allGroupPosts.value.find(gp => gp.postId === postId)
      if (groupPost) {
        const group = availableGroups.value.find(g => g.id === groupPost.groupId)
        post.icon = group?.emoji || '👥'
      } else {
        post.icon = '💬'
      }
    }
    
    setTimeout(() => {
      postActionSuccess.value = ''
    }, 3000)
  } catch (error) {
    if (error.response?.data?.message) {
      postActionError.value = error.response.data.message
    } else if (error.response?.status === 401) {
      postActionError.value = 'You must be logged in to change post groups'
    } else if (error.response?.status === 403) {
      postActionError.value = 'You can only update your own group posts'
    } else if (error.message) {
      postActionError.value = error.message
    } else {
      postActionError.value = 'Failed to change post group. Please try again.'
    }
  } finally {
    isChangingPostGroup.value = false
  }
}

// Group management functions
const isCreator = (group) => {
  return auth.currentUser?.username === group.createdByUsername
}

const startEditGroup = (group) => {
  editingGroupId.value = group.id
  editGroupName.value = group.name
  editGroupEmoji.value = group.emoji || ''
  editGroupDescription.value = group.description && group.description.includes('Created by') 
    ? '' 
    : (group.description || '')
  groupActionError.value = ''
  groupActionSuccess.value = ''
}

const cancelEditGroup = () => {
  editingGroupId.value = null
  editGroupName.value = ''
  editGroupEmoji.value = ''
  editGroupDescription.value = ''
  groupActionError.value = ''
}

const handleUpdateGroup = async (groupId) => {
  groupActionError.value = ''
  groupActionSuccess.value = ''
  
  if (!editGroupName.value.trim()) {
    groupActionError.value = 'Please enter a group name'
    return
  }
  
  if (editGroupName.value.trim().length < 5 || editGroupName.value.trim().length > 15) {
    groupActionError.value = 'Group name must be between 5 and 15 characters'
    return
  }
  
  if (editGroupEmoji.value.trim() && editGroupEmoji.value.trim().length > 10) {
    groupActionError.value = 'Emoji must be 10 characters or less'
    return
  }
  
  if (editGroupDescription.value.trim() && editGroupDescription.value.trim().length > 500) {
    groupActionError.value = 'Description must be 500 characters or less'
    return
  }
  
  isUpdatingGroup.value = true

  try {
    await updateGroup(groupId, {
      name: editGroupName.value.trim(),
      emoji: editGroupEmoji.value.trim() || undefined,
      description: editGroupDescription.value.trim() || undefined
    })
    
    groupActionSuccess.value = 'Group updated successfully!'
    
    editingGroupId.value = null
    editGroupName.value = ''
    editGroupEmoji.value = ''
    editGroupDescription.value = ''
    
    await fetchUserGroups()
    await fetchAvailableGroups()
    
    setTimeout(() => {
      groupActionSuccess.value = ''
    }, 3000)
  } catch (error) {
    if (error.response?.data?.message) {
      groupActionError.value = error.response.data.message
    } else if (error.response?.status === 401) {
      groupActionError.value = 'You must be logged in to update groups'
    } else if (error.response?.status === 403) {
      groupActionError.value = 'You can only update groups you created'
    } else if (error.message) {
      groupActionError.value = error.message
    } else {
      groupActionError.value = 'Failed to update group. Please try again.'
    }
  } finally {
    isUpdatingGroup.value = false
  }
}

const handleDeleteGroup = async (groupId) => {
  if (!confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
    return
  }
  
  groupActionError.value = ''
  groupActionSuccess.value = ''
  isDeletingGroupId.value = groupId

  try {
    await deleteGroup(groupId)
    
    groupActionSuccess.value = 'Group deleted successfully!'
    
    await fetchUserGroups()
    await fetchAvailableGroups()
    
    setTimeout(() => {
      groupActionSuccess.value = ''
    }, 3000)
  } catch (error) {
    if (error.response?.data?.message) {
      groupActionError.value = error.response.data.message
    } else if (error.response?.status === 401) {
      groupActionError.value = 'You must be logged in to delete groups'
    } else if (error.response?.status === 403) {
      groupActionError.value = 'You can only delete groups you created'
    } else if (error.message) {
      groupActionError.value = error.message
    } else {
      groupActionError.value = 'Failed to delete group. Please try again.'
    }
  } finally {
    isDeletingGroupId.value = null
  }
}

const toggleViewMembers = (groupId) => {
  if (viewingMembersForGroupId.value === groupId) {
    viewingMembersForGroupId.value = null
  } else {
    viewingMembersForGroupId.value = groupId
  }
}

const getMembersForGroup = (groupId) => {
  if (!isAdmin.value || !groupMemberships.value) return []
  return groupMemberships.value.filter(m => m.groupId === groupId)
}
</script>

<template>
  <main class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <div class="hidden lg:block w-full min-h-screen">
      <div class="px-4 py-8 md:px-6 lg:px-8 xl:px-12">
        <div class="mb-12">
          <h1 class="text-5xl font-bold text-emerald-500 mb-3">Profile Overview</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Create new posts and manage your content
          </p>
        </div>

        <div class="space-y-6">
          <FormCard
            title="Create Post"
            icon="✍️"
            description="Share your thoughts with the community"
            :success-message="successMessage"
            :error-message="errorMessage"
            @submit="createPost"
          >
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
                  {{ group.emoji || '👫' }} {{ group.name }}
                </option>
              </select>
            </div>

            <template #actions>
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
            </template>
          </FormCard>

          <FormCard
            title="Create Group"
            icon="👫"
            description="Start a new community group"
            :success-message="groupSuccessMessage"
            :error-message="groupErrorMessage"
            @submit="createGroup"
          >
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

            <div>
              <label class="block text-sm font-medium mb-2 text-emerald-500">
                Emoji (Optional)
              </label>
              <input
                v-model="groupEmoji"
                type="text"
                placeholder="e.g., ✈️ 🌍 🎨"
                maxlength="10"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 hover:border-emerald-400"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Max 10 characters</p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2 text-emerald-500">
                Description (Optional)
              </label>
              <textarea
                v-model="groupDescription"
                rows="4"
                placeholder="Describe your group..."
                maxlength="500"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 hover:border-emerald-400 resize-vertical"
              ></textarea>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ groupDescription.length }}/500 characters</p>
            </div>

            <template #actions>
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
                @click="groupName = ''; groupEmoji = ''; groupDescription = ''"
                class="px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all font-medium"
              >
                Clear
              </button>
            </template>
          </FormCard>

          <div class="mt-12">
            <SectionHeader icon="📋" title="My Posts" />

            <LoadingState v-if="isLoadingPosts" message="Loading your posts..." />

            <ErrorDisplayComponent v-if="postsErrorMessage" :message="postsErrorMessage" class="mb-6" />

            <EmptyState
              v-if="!isLoadingPosts && !postsErrorMessage && userPosts.length === 0"
              icon="📝"
              title="No posts yet"
              description="Create your first post above to get started!"
            />

            <SuccessMessage v-if="postActionSuccess" :message="postActionSuccess" class="mb-6" />
            <ErrorDisplayComponent v-if="postActionError" :message="postActionError" class="mb-6" />

            <div v-if="!isLoadingPosts && userPosts.length > 0" class="space-y-6">
              <div v-for="post in userPosts" :key="post.id">
                <PostEditForm
                  v-if="editingPostId === post.id"
                  :post-id="post.id"
                  :initial-title="editPostTitle"
                  :initial-body="editPostBody"
                  :initial-visibility="editPostVisibility"
                  :is-updating="isUpdatingPost"
                  variant="desktop"
                  @update="handleUpdatePost"
                  @cancel="cancelEditPost"
                />

                <PostActionsCard
                  v-else
                  :post="post"
                  variant="main"
                  :available-groups="availableGroups"
                  :current-group-id="getCurrentGroupForPost(post.id)"
                  :current-group-name="getCurrentGroupNameForPost(post.id)"
                  :is-loading-group-posts="isLoadingGroupPosts"
                  :is-changing-group="changingGroupForPostId === post.id"
                  :is-changing-group-in-progress="isChangingPostGroup"
                  :is-deleting-post="isDeletingPostId === post.id"
                  :selected-group-id="newGroupIdForPost"
                  @edit="startEditPost(post)"
                  @delete="handleDeletePost(post.id)"
                  @change-group="startChangeGroup(post.id)"
                  @save-group-change="handleChangePostGroup(post.id)"
                  @cancel-group-change="cancelChangeGroup"
                  @update:selected-group-id="newGroupIdForPost = $event"
                />
              </div>
            </div>
          </div>

          <div class="mt-12">
            <SectionHeader icon="👫" title="My Groups" />

            <LoadingState v-if="isLoadingGroups" message="Loading your groups..." />

            <ErrorDisplayComponent v-if="groupsErrorMessage" :message="groupsErrorMessage" class="mb-6" />

            <div v-if="isAdmin">
              <SuccessMessage v-if="memberSuccessMessage" :message="memberSuccessMessage" class="mb-6" />
              <ErrorDisplayComponent v-if="memberErrorMessage" :message="memberErrorMessage" class="mb-6" />
            </div>

            <SuccessMessage v-if="groupActionSuccess" :message="groupActionSuccess" class="mb-6" />
            <ErrorDisplayComponent v-if="groupActionError" :message="groupActionError" class="mb-6" />

            <EmptyState
              v-if="!isLoadingGroups && !groupsErrorMessage && userGroups.length === 0"
              icon="👫"
              title="No groups yet"
              description="Create your first group above to get started!"
            />

            <div v-if="!isLoadingGroups && userGroups.length > 0" class="space-y-6">
              <div v-for="group in userGroups" :key="group.id" class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg">
                <div v-if="editingGroupId === group.id">
                  <h3 class="text-xl font-semibold mb-4 text-emerald-500">Edit Group</h3>
                  
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium mb-2 text-emerald-500">
                        Group Name
                      </label>
                      <input
                        v-model="editGroupName"
                        type="text"
                        placeholder="Enter group name..."
                        class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium mb-2 text-emerald-500">
                        Emoji (Optional)
                      </label>
                      <input
                        v-model="editGroupEmoji"
                        type="text"
                        placeholder="e.g., ✈️ 🌍 🎨"
                        maxlength="10"
                        class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
                      />
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Max 10 characters</p>
                    </div>

                    <div>
                      <label class="block text-sm font-medium mb-2 text-emerald-500">
                        Description (Optional)
                      </label>
                      <textarea
                        v-model="editGroupDescription"
                        rows="4"
                        placeholder="Describe your group..."
                        maxlength="500"
                        class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all resize-vertical"
                      ></textarea>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ editGroupDescription.length }}/500 characters</p>
                    </div>

                    <div class="flex gap-2">
                      <button
                        @click="handleUpdateGroup(group.id)"
                        :disabled="isUpdatingGroup"
                        class="flex-1 px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50"
                      >
                        <span v-if="!isUpdatingGroup">💾 Save Changes</span>
                        <span v-else>Saving...</span>
                      </button>
                      <button
                        @click="cancelEditGroup"
                        class="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-emerald-400 transition-all font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>

                <div v-else>
                  <GroupPreviewCard
                    :group="group"
                    variant="main"
                  />
                  
                  <div class="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                    <div class="flex items-center gap-2 flex-wrap">
                      <button
                        v-if="isCreator(group)"
                        @click="startEditGroup(group)"
                        class="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 active:scale-95 transition-all shadow-md"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        v-if="isCreator(group)"
                        @click="handleDeleteGroup(group.id)"
                        :disabled="isDeletingGroupId === group.id"
                        class="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 active:scale-95 transition-all shadow-md disabled:opacity-50"
                      >
                        <span v-if="isDeletingGroupId === group.id">Deleting...</span>
                        <span v-else>🗑️ Delete</span>
                      </button>
                      <button
                        @click="toggleViewMembers(group.id)"
                        class="px-4 py-2 rounded-lg bg-gray-500 text-white text-sm font-medium hover:bg-gray-600 active:scale-95 transition-all shadow-md"
                      >
                        <span v-if="viewingMembersForGroupId === group.id">👥 Hide Members</span>
                        <span v-else>👥 View Members</span>
                      </button>
                    </div>

                    <div v-if="viewingMembersForGroupId === group.id" class="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <h4 class="text-sm font-semibold mb-3 text-emerald-500">Group Members</h4>
                      <div v-if="isAdmin && getMembersForGroup(group.id).length > 0" class="space-y-2">
                        <div v-for="member in getMembersForGroup(group.id)" :key="member.userId" 
                          class="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                          <span class="text-sm font-medium">{{ member.username }}</span>
                          <span class="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                            {{ member.role || 'MEMBER' }}
                          </span>
                        </div>
                      </div>
                      <div v-else-if="isAdmin && getMembersForGroup(group.id).length === 0" class="text-sm text-gray-500 dark:text-gray-400">
                        No members found
                      </div>
                      <div v-else-if="!isAdmin" class="text-sm text-gray-500 dark:text-gray-400">
                        Log in as admin to view members
                      </div>
                    </div>
                  </div>
                  
                  <AddMemberSection
                    v-if="isAdmin"
                    :group-id="group.id"
                    :all-users="allUsers"
                    :is-loading-users="isLoadingUsers"
                    :is-adding="addingMemberToGroupId === group.id"
                    :model-value="selectedUserIds[group.id]"
                    variant="desktop"
                    @update:model-value="selectedUserIds[group.id] = $event"
                    @add-member="handleAddMember(group.id)"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="mt-12">
            <SectionHeader icon="👥" title="My Memberships" />

            <LoadingState v-if="isLoadingUserMemberships" message="Loading your memberships..." />

            <ErrorDisplayComponent v-if="userMembershipsErrorMessage" :message="userMembershipsErrorMessage" class="mb-6" />

            <EmptyState
              v-if="!isLoadingUserMemberships && !userMembershipsErrorMessage && userGroupMemberships.length === 0"
              icon="👥"
              title="No memberships yet"
              description="Join or create a group to get started!"
            />

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

          <div v-if="isAdmin" class="mt-12">
            <SectionHeader icon="🛡️" title="Group Memberships Overview" />

            <LoadingState v-if="isLoadingMemberships" message="Loading memberships..." />

            <ErrorDisplayComponent v-if="membershipsErrorMessage" :message="membershipsErrorMessage" class="mb-6" />

            <EmptyState
              v-if="!isLoadingMemberships && !membershipsErrorMessage && groupMemberships.length === 0"
              icon="📊"
              title="No memberships yet"
              description="Add members to groups to see them here"
            />

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

    <div class="lg:hidden p-6 pb-24">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-emerald-500 mb-2">Profile Overview</h1>
        <p class="text-base text-gray-600 dark:text-gray-400">
          Create new posts and manage your content
        </p>
      </div>

      <div class="space-y-6">
        <FormCard
          title="Create Post"
          icon="✍️"
          :success-message="successMessage"
          :error-message="errorMessage"
          icon-size="text-2xl"
          title-size="text-xl"
          description-size="text-sm"
          variant="mobile"
          @submit="createPost"
        >
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
                {{ group.emoji || '👫' }} {{ group.name }}
              </option>
            </select>
          </div>

          <template #actions>
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
          </template>
        </FormCard>

        <FormCard
          title="Create Group"
          icon="👫"
          :success-message="groupSuccessMessage"
          :error-message="groupErrorMessage"
          icon-size="text-2xl"
          title-size="text-xl"
          description-size="text-sm"
          variant="mobile"
          @submit="createGroup"
        >
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

          <div>
            <label class="block text-sm font-medium mb-2 text-emerald-500">
              Emoji (Optional)
            </label>
            <input
              v-model="groupEmoji"
              type="text"
              placeholder="e.g., ✈️ 🌍 🎨"
              maxlength="10"
              class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Max 10 characters</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2 text-emerald-500">
              Description (Optional)
            </label>
            <textarea
              v-model="groupDescription"
              rows="4"
              placeholder="Describe your group..."
              maxlength="500"
              class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all resize-vertical"
            ></textarea>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ groupDescription.length }}/500 characters</p>
          </div>

          <template #actions>
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
              @click="groupName = ''; groupEmoji = ''; groupDescription = ''"
              class="w-full px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-emerald-400 transition-all font-medium"
            >
              Clear
            </button>
          </template>
        </FormCard>

        <div class="mt-12">
          <SectionHeader icon="📋" title="My Posts" icon-size="text-3xl" title-size="text-2xl" />

          <LoadingState v-if="isLoadingPosts" message="Loading your posts..." />

          <ErrorDisplayComponent v-if="postsErrorMessage" :message="postsErrorMessage" class="mb-4" />

          <SuccessMessage v-if="postActionSuccess" :message="postActionSuccess" class="mb-4" />
          <ErrorDisplayComponent v-if="postActionError" :message="postActionError" class="mb-4" />

          <EmptyState
            v-if="!isLoadingPosts && !postsErrorMessage && userPosts.length === 0"
            icon="📝"
            title="No posts yet"
            description="Create your first post above to get started!"
            icon-size="text-5xl"
            title-size="text-lg"
          />

          <div v-if="!isLoadingPosts && userPosts.length > 0" class="space-y-6">
            <div v-for="post in userPosts" :key="post.id">
              <PostEditForm
                v-if="editingPostId === post.id"
                :post-id="post.id"
                :initial-title="editPostTitle"
                :initial-body="editPostBody"
                :initial-visibility="editPostVisibility"
                :is-updating="isUpdatingPost"
                variant="mobile"
                @update="handleUpdatePost"
                @cancel="cancelEditPost"
              />

              <PostActionsCard
                v-else
                :post="post"
                variant="mobile"
                :available-groups="availableGroups"
                :current-group-id="getCurrentGroupForPost(post.id)"
                :current-group-name="getCurrentGroupNameForPost(post.id)"
                :is-loading-group-posts="isLoadingGroupPosts"
                :is-changing-group="changingGroupForPostId === post.id"
                :is-changing-group-in-progress="isChangingPostGroup"
                :is-deleting-post="isDeletingPostId === post.id"
                :selected-group-id="newGroupIdForPost"
                :show-group-change="changingGroupForPostId === post.id"
                @edit="startEditPost(post)"
                @delete="handleDeletePost(post.id)"
                @change-group="startChangeGroup(post.id)"
                @save-group-change="handleChangePostGroup(post.id)"
                @cancel-group-change="cancelChangeGroup"
                @update:selected-group-id="newGroupIdForPost = $event"
              />
            </div>
          </div>
        </div>

        <div class="mt-12">
          <SectionHeader icon="👫" title="My Groups" icon-size="text-3xl" title-size="text-2xl" />

          <LoadingState v-if="isLoadingGroups" message="Loading your groups..." />

          <ErrorDisplayComponent v-if="groupsErrorMessage" :message="groupsErrorMessage" class="mb-4" />

          <div v-if="isAdmin">
            <SuccessMessage v-if="memberSuccessMessage" :message="memberSuccessMessage" class="mb-4" />
            <ErrorDisplayComponent v-if="memberErrorMessage" :message="memberErrorMessage" class="mb-4" />
          </div>

          <SuccessMessage v-if="groupActionSuccess" :message="groupActionSuccess" class="mb-4" />
          <ErrorDisplayComponent v-if="groupActionError" :message="groupActionError" class="mb-4" />

          <EmptyState
            v-if="!isLoadingGroups && !groupsErrorMessage && userGroups.length === 0"
            icon="👫"
            title="No groups yet"
            description="Create your first group above to get started!"
            icon-size="text-5xl"
            title-size="text-lg"
          />

          <div v-if="!isLoadingGroups && userGroups.length > 0" class="space-y-6">
            <div v-for="group in userGroups" :key="group.id" class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg">
              <div v-if="editingGroupId === group.id">
                <h3 class="text-lg font-semibold mb-4 text-emerald-500">Edit Group</h3>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium mb-2 text-emerald-500">
                      Group Name
                    </label>
                    <input
                      v-model="editGroupName"
                      type="text"
                      placeholder="Enter group name..."
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium mb-2 text-emerald-500">
                      Emoji (Optional)
                    </label>
                    <input
                      v-model="editGroupEmoji"
                      type="text"
                      placeholder="e.g., ✈️ 🌍 🎨"
                      maxlength="10"
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
                    />
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Max 10 characters</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium mb-2 text-emerald-500">
                      Description (Optional)
                    </label>
                    <textarea
                      v-model="editGroupDescription"
                      rows="4"
                      placeholder="Describe your group..."
                      maxlength="500"
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all resize-vertical"
                    ></textarea>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ editGroupDescription.length }}/500 characters</p>
                  </div>

                  <div class="flex flex-col gap-2">
                    <button
                      @click="handleUpdateGroup(group.id)"
                      :disabled="isUpdatingGroup"
                      class="w-full px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50"
                    >
                      <span v-if="!isUpdatingGroup">💾 Save Changes</span>
                      <span v-else>Saving...</span>
                    </button>
                    <button
                      @click="cancelEditGroup"
                      class="w-full px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-emerald-400 transition-all font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              <div v-else>
                <GroupPreviewCard
                  :group="group"
                  variant="mobile"
                />
                
                <div class="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                  <div class="flex flex-col gap-2">
                    <button
                      v-if="isCreator(group)"
                      @click="startEditGroup(group)"
                      class="w-full px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 active:scale-95 transition-all shadow-md"
                    >
                      ✏️ Edit Group
                    </button>
                    <button
                      v-if="isCreator(group)"
                      @click="handleDeleteGroup(group.id)"
                      :disabled="isDeletingGroupId === group.id"
                      class="w-full px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 active:scale-95 transition-all shadow-md disabled:opacity-50"
                    >
                      <span v-if="isDeletingGroupId === group.id">Deleting...</span>
                      <span v-else>🗑️ Delete Group</span>
                    </button>
                    <button
                      @click="toggleViewMembers(group.id)"
                      class="w-full px-4 py-2 rounded-lg bg-gray-500 text-white text-sm font-medium hover:bg-gray-600 active:scale-95 transition-all shadow-md"
                    >
                      <span v-if="viewingMembersForGroupId === group.id">👥 Hide Members</span>
                      <span v-else>👥 View Members</span>
                    </button>
                  </div>

                  <div v-if="viewingMembersForGroupId === group.id" class="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <h4 class="text-sm font-semibold mb-3 text-emerald-500">Group Members</h4>
                    <div v-if="isAdmin && getMembersForGroup(group.id).length > 0" class="space-y-2">
                      <div v-for="member in getMembersForGroup(group.id)" :key="member.userId" 
                        class="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                        <span class="text-sm font-medium">{{ member.username }}</span>
                        <span class="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                          {{ member.role || 'MEMBER' }}
                        </span>
                      </div>
                    </div>
                    <div v-else-if="isAdmin && getMembersForGroup(group.id).length === 0" class="text-sm text-gray-500 dark:text-gray-400">
                      No members found
                    </div>
                    <div v-else-if="!isAdmin" class="text-sm text-gray-500 dark:text-gray-400">
                      Log in as admin to view members
                    </div>
                  </div>
                </div>
                
                <AddMemberSection
                  v-if="isAdmin"
                  :group-id="group.id"
                  :all-users="allUsers"
                  :is-loading-users="isLoadingUsers"
                  :is-adding="addingMemberToGroupId === group.id"
                  :model-value="selectedUserIds[group.id]"
                  variant="mobile"
                  @update:model-value="selectedUserIds[group.id] = $event"
                  @add-member="handleAddMember(group.id)"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-12">
          <SectionHeader icon="👥" title="My Memberships" icon-size="text-3xl" title-size="text-2xl" />

          <LoadingState v-if="isLoadingUserMemberships" message="Loading your memberships..." />

          <ErrorDisplayComponent v-if="userMembershipsErrorMessage" :message="userMembershipsErrorMessage" class="mb-4" />

          <EmptyState
            v-if="!isLoadingUserMemberships && !userMembershipsErrorMessage && userGroupMemberships.length === 0"
            icon="👥"
            title="No memberships yet"
            description="Join or create a group to get started!"
            icon-size="text-5xl"
            title-size="text-lg"
          />

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

        <div v-if="isAdmin" class="mt-12">
          <SectionHeader icon="🛡️" title="Group Memberships Overview" icon-size="text-3xl" title-size="text-2xl" />

          <LoadingState v-if="isLoadingMemberships" message="Loading memberships..." />

          <ErrorDisplayComponent v-if="membershipsErrorMessage" :message="membershipsErrorMessage" class="mb-4" />

          <EmptyState
            v-if="!isLoadingMemberships && !membershipsErrorMessage && groupMemberships.length === 0"
            icon="📊"
            title="No memberships yet"
            description="Add members to groups to see them here"
            icon-size="text-5xl"
            title-size="text-lg"
          />

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
