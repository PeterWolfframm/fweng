<script setup>
import { ref, onMounted, computed } from 'vue'
import TwoColumnLayout from '../components/TwoColumnLayout.vue'
import PostPreviewCard from '../components/PostPreviewCard.vue'
import GroupPreviewCard from '../components/GroupPreviewCard.vue'
import { useAuthStore } from '@/stores/auth'
import { fetchPublicPosts, fetchAllGroups } from '@/config/api'

const auth = useAuthStore()

// Reactive state for posts
const articles = ref([])
const loading = ref(true)
const error = ref(null)

// Reactive state for groups
const groups = ref([])
const groupsLoading = ref(true)
const groupsError = ref(null)

// Get first three groups
const firstThreeGroups = computed(() => groups.value.slice(0, 3))

// Fetch posts and groups on component mount
onMounted(async () => {
  // Fetch posts
  try {
    loading.value = true
    error.value = null
    
    const response = await fetchPublicPosts()
    
    // Map API response to match expected format
    articles.value = response.data.map(post => ({
      id: post.id,
      title: post.title,
      content: post.body,
      icon: '💬', // Default icon since API doesn't provide it
      createdAt: post.createdAt
    }))
  } catch (err) {
    console.error('Failed to fetch posts:', err)
    error.value = err.response?.data?.message || 'Failed to load posts. Please try again.'
  } finally {
    loading.value = false
  }

  // Fetch groups
  try {
    groupsLoading.value = true
    groupsError.value = null
    
    const response = await fetchAllGroups()
    
    // Map API response and add default icon/description if missing
    groups.value = response.data.map(group => ({
      ...group,
      icon: group.icon || '👥',
      description: group.description || 'A community for sharing and discussion.'
    }))
  } catch (err) {
    console.error('Failed to fetch groups:', err)
    groupsError.value = err.response?.data?.message || 'Failed to load groups.'
  } finally {
    groupsLoading.value = false
  }
})
</script>

<template>
  <TwoColumnLayout>
    <template #sidebar>
      <div class="px-0 pt-0">
        <h1 class="text-6xl font-bold mb-2">🗣️ yap.</h1>
        <p v-if="auth.currentUser" class="text-xl text-gray-500 dark:text-gray-400 mb-8">
          @{{ auth.currentUser.username }}
        </p>
        <div class="mt-12">
          <!-- Groups Loading State -->
          <div v-if="groupsLoading" class="text-sm text-gray-500 dark:text-gray-400">
            Loading groups...
          </div>
          
          <!-- Groups Error State -->
          <div v-else-if="groupsError" class="text-sm text-red-500 dark:text-red-400">
            {{ groupsError }}
          </div>
          
          <!-- Groups List -->
          <template v-else>
            <GroupPreviewCard
              v-for="group in firstThreeGroups"
              :key="group.id"
              :group="group"
              variant="sidebar"
            />
          </template>
        </div>
      </div>
    </template>

    <template #main>
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">Loading posts...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-500 dark:text-red-400 mb-2">{{ error }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Please make sure you're logged in to view posts.
        </p>
      </div>

      <!-- Empty State -->
      <div v-else-if="articles.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No posts available yet.</p>
      </div>

      <!-- Posts List -->
      <PostPreviewCard
        v-else
        v-for="article in articles"
        :key="article.id"
        :post="article"
        variant="main"
      />
    </template>

    <template #mobile>
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">Loading posts...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-500 dark:text-red-400 mb-2">{{ error }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Please make sure you're logged in to view posts.
        </p>
      </div>

      <!-- Empty State -->
      <div v-else-if="articles.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No posts available yet.</p>
      </div>

      <!-- Posts List -->
      <PostPreviewCard
        v-else
        v-for="article in articles"
        :key="article.id"
        :post="article"
        variant="mobile"
      />
    </template>
  </TwoColumnLayout>
</template>
