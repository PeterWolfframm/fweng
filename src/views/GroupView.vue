<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TwoColumnLayout from '../components/TwoColumnLayout.vue'
import FullScreenWidth from '../components/FullScreenWidth.vue'
import GroupPreviewCard from '../components/GroupPreviewCard.vue'
import PostPreviewCard from '../components/PostPreviewCard.vue'
import DetailHeader from '../components/DetailHeader.vue'
import { fetchAllGroups, fetchGroupPosts, fetchAllGroupPosts, fetchPublicPosts, joinGroup, apiClient } from '@/config/api'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const groups = ref([])
const loading = ref(true)
const error = ref(null)

const posts = ref([])
const postsLoading = ref(true)
const postsError = ref(null)

const groupPostAssociations = ref([])

const isMember = ref(false)
const isJoining = ref(false)
const joinError = ref(null)
const joinSuccess = ref(false)

const currentGroup = computed(() => {
  const name = route.params.name
  if (!name) return null
  return groups.value.find((group) => group.name === name)
})

const groupPosts = computed(() => {
  if (!currentGroup.value) return []
  
  const postIdsInGroup = groupPostAssociations.value
    .filter((assoc) => assoc.groupId === currentGroup.value.id)
  
  return posts.value
    .map((post) => {
      const association = postIdsInGroup.find((assoc) => assoc.postId === post.id)
      return {
        ...post,
        sharedBy: association?.sharedBy
      }
    })
    .filter((post) => postIdsInGroup.some((assoc) => assoc.postId === post.id))
})

onMounted(async () => {
  // Fetch groups list - only if logged in (backend requires auth)
  if (auth.isLoggedIn) {
    try {
      loading.value = true
      error.value = null
      
      const response = await fetchAllGroups()
      
      groups.value = response.data.map(group => ({
        ...group,
        emoji: group.emoji || '👥',
        description: group.description || 'A community for sharing and discussion.'
      }))
    } catch (err) {
      console.error('Failed to fetch groups:', err)
      error.value = err.response?.data?.message || 'Failed to load groups.'
    } finally {
      loading.value = false
    }
  } else {
    // Not logged in - create placeholder group from route params
    loading.value = false
    const groupName = route.params.name
    if (groupName) {
      groups.value = [{
        name: groupName,
        emoji: '👥',
        description: 'Login to see full group details'
      }]
    }
  }

  // Fetch posts and group associations
  try {
    postsLoading.value = true
    postsError.value = null
    
    // Only fetch group associations if logged in (backend requires auth)
    if (auth.isLoggedIn) {
      try {
        const groupPostsResponse = await fetchAllGroupPosts()
        groupPostAssociations.value = groupPostsResponse.data.map(gp => ({
          groupId: gp.groupId,
          postId: gp.postId,
          sharedBy: gp.username,
          sharedById: gp.userId
        }))
      } catch (err) {
        console.error('Failed to fetch group associations:', err)
      }
    }
    
    // Fetch posts based on auth status
    if (auth.isLoggedIn) {
      try {
        const response = await fetchGroupPosts()
        
        // Create a map of groupId -> emoji for quick lookup
        const groupsEmojiMap = groups.value.reduce((map, group) => {
          map[group.id] = group.emoji || '👥'
          return map
        }, {})
        
        posts.value = response.data.map(post => {
          const association = groupPostAssociations.value.find(assoc => assoc.postId === post.id)
          const groupEmoji = association && groupsEmojiMap[association.groupId] ? groupsEmojiMap[association.groupId] : '💬'
          return {
            id: post.id,
            title: post.title,
            content: post.body,
            icon: groupEmoji,
            createdAt: post.createdAt
          }
        })
      } catch (err) {
        console.error('Failed to fetch group posts:', err)
        posts.value = []
      }
    } else {
      // Fetch public posts for logged-out users
      try {
        const response = await fetchPublicPosts()
        
        posts.value = response.data.map(post => ({
          id: post.id,
          title: post.title,
          content: post.body,
          icon: '💬',
          createdAt: post.createdAt
        }))
      } catch (err) {
        console.error('Failed to fetch public posts:', err)
        posts.value = []
      }
    }
  } catch (err) {
    console.error('Failed to fetch post data:', err)
    postsError.value = err.response?.data?.message || 'Failed to load posts.'
  } finally {
    postsLoading.value = false
  }
  
  await checkMembership()
})

const checkMembership = async () => {
  if (!auth.isLoggedIn || !currentGroup.value) {
    isMember.value = false
    return
  }
  
  try {
    const response = await apiClient.get('/groups/my-groups')
    isMember.value = response.data.some(g => g.id === currentGroup.value.id)
  } catch (err) {
    console.error('Failed to check membership:', err)
    isMember.value = false
  }
}

const handleJoinGroup = async () => {
  if (!auth.isLoggedIn) {
    joinError.value = 'Please log in to join groups'
    return
  }
  
  isJoining.value = true
  joinError.value = null
  joinSuccess.value = false
  
  try {
    await joinGroup(currentGroup.value.id)
    joinSuccess.value = true
    isMember.value = true
    
    try {
      const response = await fetchGroupPosts()
      
      // Create a map of groupId -> emoji for quick lookup
      const groupsEmojiMap = groups.value.reduce((map, group) => {
        map[group.id] = group.emoji || '👥'
        return map
      }, {})
      
      posts.value = response.data.map(post => {
        const association = groupPostAssociations.value.find(assoc => assoc.postId === post.id)
        const groupEmoji = association && groupsEmojiMap[association.groupId] ? groupsEmojiMap[association.groupId] : '💬'
        return {
          id: post.id,
          title: post.title,
          content: post.body,
          icon: groupEmoji,
          createdAt: post.createdAt
        }
      })
    } catch (err) {
      console.error('Failed to refresh posts after joining:', err)
    }
    
    setTimeout(() => {
      joinSuccess.value = false
    }, 3000)
  } catch (err) {
    joinError.value = err.response?.data?.message || 'Failed to join group'
  } finally {
    isJoining.value = false
  }
}

watch(currentGroup, () => {
  if (currentGroup.value) {
    checkMembership()
  }
})
</script>

<template>
  <div v-if="loading" class="flex justify-center items-center min-h-screen">
    <p class="text-gray-500 dark:text-gray-400">Loading groups...</p>
  </div>

  <div v-else-if="error && auth.isLoggedIn" class="flex justify-center items-center min-h-screen">
    <div class="text-center">
      <p class="text-red-500 dark:text-red-400 mb-2">{{ error }}</p>
    </div>
  </div>

  <TwoColumnLayout v-else-if="currentGroup">
    <template #sidebar>
      <GroupPreviewCard
        v-for="group in groups"
        :key="group.id"
        :group="group"
        :isActive="currentGroup && currentGroup.name === group.name"
        variant="sidebar"
        contentClass="text-sm opacity-70"
      />
    </template>

    <template #main>
      <DetailHeader :title="currentGroup.name" :description="currentGroup.description" variant="main" />
      
      <div v-if="auth.isLoggedIn && !isMember" class="mt-4 mb-6">
        <button 
          @click="handleJoinGroup"
          :disabled="isJoining"
          class="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-colors"
        >
          {{ isJoining ? 'Joining...' : 'Join Group' }}
        </button>
        <p v-if="joinError" class="text-red-500 text-sm mt-2">{{ joinError }}</p>
        <p v-if="joinSuccess" class="text-green-500 text-sm mt-2">Successfully joined!</p>
      </div>
      <div v-else-if="!auth.isLoggedIn" class="mt-4 mb-6 text-gray-500 dark:text-gray-400 text-sm">
        Log in to join this group
      </div>
      
      <div v-if="postsLoading" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">Loading posts...</p>
      </div>

      <div v-else-if="postsError" class="text-center py-8">
        <p class="text-red-500 dark:text-red-400">{{ postsError }}</p>
      </div>

      <div v-else-if="groupPosts.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">
          {{ auth.isLoggedIn ? 'No posts in this group yet.' : 'Login to see posts in this group.' }}
        </p>
      </div>

      <PostPreviewCard
        v-else
        v-for="post in groupPosts"
        :key="post.id"
        :post="post"
        :shared-by="post.sharedBy"
        :group-name="currentGroup.name"
        variant="main"
        :show-emoji="false"
      />
    </template>

    <template #mobile>
      <div class="group-content">
        <button
          @click="router.push('/groups')"
          class="mb-6 text-emerald-500 hover:opacity-70 flex items-center gap-2"
        >
          ← Back to groups
        </button>
        <DetailHeader :title="currentGroup.name" :description="currentGroup.description" variant="mobile" />
        
        <div v-if="auth.isLoggedIn && !isMember" class="mt-4 mb-6">
          <button 
            @click="handleJoinGroup"
            :disabled="isJoining"
            class="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-colors"
          >
            {{ isJoining ? 'Joining...' : 'Join Group' }}
          </button>
          <p v-if="joinError" class="text-red-500 text-sm mt-2">{{ joinError }}</p>
          <p v-if="joinSuccess" class="text-green-500 text-sm mt-2">Successfully joined!</p>
        </div>
        <div v-else-if="!auth.isLoggedIn" class="mt-4 mb-6 text-gray-500 dark:text-gray-400 text-sm">
          Log in to join this group
        </div>
        
        <div v-if="postsLoading" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">Loading posts...</p>
        </div>

        <div v-else-if="postsError" class="text-center py-8">
          <p class="text-red-500 dark:text-red-400">{{ postsError }}</p>
        </div>

        <div v-else-if="groupPosts.length === 0" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">
            {{ auth.isLoggedIn ? 'No posts in this group yet.' : 'Login to see posts in this group.' }}
          </p>
        </div>

        <PostPreviewCard
          v-else
          v-for="post in groupPosts"
          :key="post.id"
          :post="post"
          :shared-by="post.sharedBy"
          :group-name="currentGroup.name"
          variant="mobile"
          :show-emoji="false"
        />
      </div>
    </template>
  </TwoColumnLayout>

  <FullScreenWidth v-else>
    <template #desktop>
      <div v-if="groups.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No groups available yet.</p>
      </div>
      
      <template v-else>
        <GroupPreviewCard
          v-for="group in groups"
          :key="group.id"
          :group="group"
          variant="main"
        />
      </template>
    </template>

    <template #mobile>
      <div v-if="groups.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No groups available yet.</p>
      </div>
      
      <template v-else>
        <GroupPreviewCard
          v-for="group in groups"
          :key="group.id"
          :group="group"
          variant="mobile"
          contentClass="text-sm opacity-70"
        />
      </template>
    </template>
  </FullScreenWidth>
</template>
