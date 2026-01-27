<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TwoColumnLayout from '../components/TwoColumnLayout.vue'
import FullScreenWidth from '../components/FullScreenWidth.vue'
import PostPreviewCard from '../components/PostPreviewCard.vue'
import DetailHeader from '../components/DetailHeader.vue'
import { fetchPublicPosts, fetchAllGroups, fetchAllGroupPosts } from '@/config/api'

const route = useRoute()
const router = useRouter()

// Reactive state for posts
const posts = ref([])
const loading = ref(true)
const error = ref(null)

// Reactive state for group-post associations
const groupPostAssociations = ref([])

const currentPost = computed(() => {
  const title = route.params.title
  if (!title) return null
  return posts.value.find((post) => post.title === title)
})

// Fetch posts on component mount
onMounted(async () => {
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
    posts.value = response.data.map(post => {
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
})
</script>

<template>
  <!-- Loading State -->
  <div v-if="loading" class="flex justify-center items-center min-h-screen">
    <p class="text-gray-500 dark:text-gray-400">Loading posts...</p>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="flex justify-center items-center min-h-screen">
    <div class="text-center">
      <p class="text-red-500 dark:text-red-400 mb-2">{{ error }}</p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Please make sure you're logged in to view posts.
      </p>
    </div>
  </div>

  <!-- Post Detail View (Two Column Layout) -->
  <TwoColumnLayout v-else-if="currentPost">
    <template #sidebar>
      <PostPreviewCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        :isActive="currentPost && currentPost.title === post.title"
        :shared-by="post.sharedBy"
        :group-name="post.groupName"
        variant="sidebar"
        contentClass="text-sm opacity-70"
      />
    </template>

    <template #main>
      <DetailHeader :title="currentPost.title" :description="currentPost.content" variant="main" />
      
      <!-- Author and Group Information -->
      <div v-if="currentPost.groupName || currentPost.sharedBy" class="mt-4 flex flex-wrap items-center gap-2">
        <!-- Group Badge -->
        <div v-if="currentPost.groupName" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
          <span>👫</span>
          <span>{{ currentPost.groupName }}</span>
        </div>
        
        <!-- Shared By -->
        <div v-if="currentPost.sharedBy" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium">
          <span>@{{ currentPost.sharedBy }}</span>
        </div>
      </div>
    </template>

    <template #mobile>
      <div class="post-content">
        <button
          @click="router.push('/posts')"
          class="mb-6 text-emerald-500 hover:opacity-70 flex items-center gap-2"
        >
          ← Back to Posts
        </button>
        <DetailHeader
          :title="currentPost.title"
          :description="currentPost.content"
          variant="mobile"
        />
        
        <!-- Author and Group Information -->
        <div v-if="currentPost.groupName || currentPost.sharedBy" class="mt-4 flex flex-wrap items-center gap-2">
          <!-- Group Badge -->
          <div v-if="currentPost.groupName" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
            <span>👫</span>
            <span>{{ currentPost.groupName }}</span>
          </div>
          
          <!-- Shared By -->
          <div v-if="currentPost.sharedBy" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium">
            <span>@{{ currentPost.sharedBy }}</span>
          </div>
        </div>
      </div>
    </template>
  </TwoColumnLayout>

  <!-- All Posts View (Full Screen Layout) -->
  <FullScreenWidth v-else>
    <template #desktop>
      <!-- Empty State -->
      <div v-if="posts.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No posts available yet.</p>
      </div>
      
      <!-- Posts List -->
      <template v-else>
        <PostPreviewCard 
          v-for="post in posts" 
          :key="post.id" 
          :post="post"
          :shared-by="post.sharedBy"
          :group-name="post.groupName"
          variant="main" 
        />
      </template>
    </template>

    <template #mobile>
      <!-- Empty State -->
      <div v-if="posts.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No posts available yet.</p>
      </div>
      
      <!-- Posts List -->
      <template v-else>
        <PostPreviewCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          :shared-by="post.sharedBy"
          :group-name="post.groupName"
          variant="mobile"
          contentClass="text-sm opacity-70"
        />
      </template>
    </template>
  </FullScreenWidth>
</template>
