<script setup>
import { ref, onMounted, computed } from 'vue'
import TwoColumnLayout from '../components/TwoColumnLayout.vue'
import PostPreviewCard from '../components/PostPreviewCard.vue'
import GroupPreviewCard from '../components/GroupPreviewCard.vue'
import { useAuthStore } from '@/stores/auth'
import { fetchPublicPosts, fetchAllGroups, fetchAllGroupPosts } from '@/config/api'

const auth = useAuthStore()

// Reactive state for posts
const articles = ref([])
const loading = ref(true)
const error = ref(null)

// Reactive state for groups
const groups = ref([])
const groupsLoading = ref(true)
const groupsError = ref(null)

// Reactive state for group-post associations
const groupPostAssociations = ref([])

// Get first three groups
const firstThreeGroups = computed(() => groups.value.slice(0, 3))

// Fetch posts and groups on component mount
onMounted(async () => {
  // Fetch posts
  try {
    loading.value = true
    error.value = null
    
    const response = await fetchPublicPosts()
    
    // Fetch group-post associations
    let groupsMap = {}
    try {
      const groupPostsResponse = await fetchAllGroupPosts()
      groupPostAssociations.value = groupPostsResponse.data.map(gp => ({
        postId: gp.postId,
        groupId: gp.groupId,
        sharedBy: gp.username,
        sharedById: gp.userId
      }))
      
      // Fetch groups to map group IDs to names
      const groupsResponse = await fetchAllGroups()
      groupsMap = groupsResponse.data.reduce((map, group) => {
        map[group.id] = group.name
        return map
      }, {})
    } catch (err) {
      console.error('Failed to fetch group associations:', err)
    }
    
    // Map API response and include group/author information
    articles.value = response.data.map(post => {
      const association = groupPostAssociations.value.find(assoc => assoc.postId === post.id)
      return {
        id: post.id,
        title: post.title,
        content: post.body,
        icon: '💬', // Default icon since API doesn't provide it
        createdAt: post.createdAt,
        sharedBy: association?.sharedBy,
        groupName: association ? groupsMap[association.groupId] : null
      }
    })
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
        :shared-by="article.sharedBy"
        :group-name="article.groupName"
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
        :shared-by="article.sharedBy"
        :group-name="article.groupName"
        variant="mobile"
      />
    </template>
  </TwoColumnLayout>
</template>
