<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TwoColumnLayout from '../components/TwoColumnLayout.vue'
import FullScreenWidth from '../components/FullScreenWidth.vue'
import GroupPreviewCard from '../components/GroupPreviewCard.vue'
import PostPreviewCard from '../components/PostPreviewCard.vue'
import DetailHeader from '../components/DetailHeader.vue'
import { fetchAllGroups, fetchGroupPosts, fetchAllGroupPosts } from '@/config/api'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

// Reactive state for groups
const groups = ref([])
const loading = ref(true)
const error = ref(null)

// Reactive state for posts
const posts = ref([])
const postsLoading = ref(true)
const postsError = ref(null)

// Reactive state for group-post associations
const groupPostAssociations = ref([])

const currentGroup = computed(() => {
  const name = route.params.name
  if (!name) return null
  return groups.value.find((group) => group.name === name)
})

const groupPosts = computed(() => {
  if (!currentGroup.value) return []
  
  // Get post IDs that are associated with this group
  const postIdsInGroup = groupPostAssociations.value
    .filter((assoc) => assoc.groupId === currentGroup.value.id)
    .map((assoc) => assoc.postId)
  
  // Filter posts to only include those associated with this group
  return posts.value.filter((post) => postIdsInGroup.includes(post.id))
})

// Fetch groups and posts on component mount
onMounted(async () => {
  // Fetch groups
  try {
    loading.value = true
    error.value = null
    
    const response = await fetchAllGroups()
    
    // Map API response and add default icon/description if missing
    groups.value = response.data.map(group => ({
      ...group,
      icon: group.icon || '👥',
      description: group.description || 'A community for sharing and discussion.'
    }))
  } catch (err) {
    console.error('Failed to fetch groups:', err)
    error.value = err.response?.data?.message || 'Failed to load groups. Please try again.'
  } finally {
    loading.value = false
  }

  // Fetch group-post associations and posts
  try {
    postsLoading.value = true
    postsError.value = null
    
    // First, fetch all group-post associations to know which posts belong to which groups
    const groupPostsResponse = await fetchAllGroupPosts()
    groupPostAssociations.value = groupPostsResponse.data || []
    
    // Then fetch posts from groups the user is a member of (if authenticated)
    if (auth.isLoggedIn) {
      try {
        const response = await fetchGroupPosts()
        
        // Map API response to match expected format
        posts.value = response.data.map(post => ({
          id: post.id,
          title: post.title,
          content: post.body,
          icon: '💬',
          createdAt: post.createdAt
        }))
      } catch (err) {
        // If not authenticated or other error, posts will be empty
        console.error('Failed to fetch group posts:', err)
        posts.value = []
      }
    } else {
      // Not logged in, can't see group posts
      posts.value = []
    }
  } catch (err) {
    console.error('Failed to fetch group data:', err)
    postsError.value = err.response?.data?.message || 'Failed to load posts.'
  } finally {
    postsLoading.value = false
  }
})
</script>

<template>
  <!-- Loading State -->
  <div v-if="loading" class="flex justify-center items-center min-h-screen">
    <p class="text-gray-500 dark:text-gray-400">Loading groups...</p>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="flex justify-center items-center min-h-screen">
    <div class="text-center">
      <p class="text-red-500 dark:text-red-400 mb-2">{{ error }}</p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Please make sure you're logged in to view groups.
      </p>
    </div>
  </div>

  <!-- Group Detail View (Two Column Layout) -->
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
      
      <!-- Posts Loading State -->
      <div v-if="postsLoading" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">Loading posts...</p>
      </div>

      <!-- Posts Error State -->
      <div v-else-if="postsError" class="text-center py-8">
        <p class="text-red-500 dark:text-red-400">{{ postsError }}</p>
      </div>

      <!-- Empty Posts State -->
      <div v-else-if="groupPosts.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No posts in this group yet.</p>
      </div>

      <!-- Posts List -->
      <PostPreviewCard
        v-else
        v-for="post in groupPosts"
        :key="post.id"
        :post="post"
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
        
        <!-- Posts Loading State -->
        <div v-if="postsLoading" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">Loading posts...</p>
        </div>

        <!-- Posts Error State -->
        <div v-else-if="postsError" class="text-center py-8">
          <p class="text-red-500 dark:text-red-400">{{ postsError }}</p>
        </div>

        <!-- Empty Posts State -->
        <div v-else-if="groupPosts.length === 0" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">No posts in this group yet.</p>
        </div>

        <!-- Posts List -->
        <PostPreviewCard
          v-else
          v-for="post in groupPosts"
          :key="post.id"
          :post="post"
          variant="mobile"
          :show-emoji="false"
        />
      </div>
    </template>
  </TwoColumnLayout>

  <!-- All Groups View (Full Screen Layout) -->
  <FullScreenWidth v-else>
    <template #desktop>
      <!-- Empty State -->
      <div v-if="groups.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No groups available yet.</p>
      </div>
      
      <!-- Groups List -->
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
      <!-- Empty State -->
      <div v-if="groups.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No groups available yet.</p>
      </div>
      
      <!-- Groups List -->
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
