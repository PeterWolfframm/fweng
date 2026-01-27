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

const posts = ref([])
const loading = ref(true)
const error = ref(null)

const groupPostAssociations = ref([])

const currentPost = computed(() => {
  const title = route.params.title
  if (!title) return null
  return posts.value.find((post) => post.title === title)
})

onMounted(async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetchPublicPosts()
    
    let groupsMap = {}
    let groupsEmojiMap = {}
    try {
      const groupPostsResponse = await fetchAllGroupPosts()
      groupPostAssociations.value = groupPostsResponse.data.map(gp => ({
        postId: gp.postId,
        groupId: gp.groupId,
        sharedBy: gp.username,
        sharedById: gp.userId
      }))
      
      const groupsResponse = await fetchAllGroups()
      groupsMap = groupsResponse.data.reduce((map, group) => {
        map[group.id] = group.name
        return map
      }, {})
      groupsEmojiMap = groupsResponse.data.reduce((map, group) => {
        map[group.id] = group.emoji || '👥'
        return map
      }, {})
    } catch (err) {
      console.error('Failed to fetch group associations:', err)
    }
    
    posts.value = response.data.map(post => {
      const association = groupPostAssociations.value.find(assoc => assoc.postId === post.id)
      return {
        id: post.id,
        title: post.title,
        content: post.body,
        icon: association && groupsEmojiMap[association.groupId] ? groupsEmojiMap[association.groupId] : '💬',
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
  <div v-if="loading" class="flex justify-center items-center min-h-screen">
    <p class="text-gray-500 dark:text-gray-400">Loading posts...</p>
  </div>

  <div v-else-if="error" class="flex justify-center items-center min-h-screen">
    <div class="text-center">
      <p class="text-red-500 dark:text-red-400 mb-2">{{ error }}</p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Please make sure you're logged in to view posts.
      </p>
    </div>
  </div>

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
      
      <div v-if="currentPost.groupName || currentPost.sharedBy" class="mt-4 flex flex-wrap items-center gap-2">
        <div v-if="currentPost.groupName" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
          <span>👫</span>
          <span>{{ currentPost.groupName }}</span>
        </div>
        
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
        
        <div v-if="currentPost.groupName || currentPost.sharedBy" class="mt-4 flex flex-wrap items-center gap-2">
          <div v-if="currentPost.groupName" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
            <span>👫</span>
            <span>{{ currentPost.groupName }}</span>
          </div>
          
          <div v-if="currentPost.sharedBy" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium">
            <span>@{{ currentPost.sharedBy }}</span>
          </div>
        </div>
      </div>
    </template>
  </TwoColumnLayout>

  <FullScreenWidth v-else>
    <template #desktop>
      <div v-if="posts.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No posts available yet.</p>
      </div>
      
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
      <div v-if="posts.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No posts available yet.</p>
      </div>
      
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
