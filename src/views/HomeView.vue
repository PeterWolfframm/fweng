<script setup>
import { ref, onMounted, computed } from 'vue'
import TwoColumnLayout from '../components/TwoColumnLayout.vue'
import PostPreviewCard from '../components/PostPreviewCard.vue'
import GroupPreviewCard from '../components/GroupPreviewCard.vue'
import { useAuthStore } from '@/stores/auth'
import { fetchPublicPosts, fetchAllGroups, fetchAllGroupPosts, fetchMyGroups } from '@/config/api'

const auth = useAuthStore()

const articles = ref([])
const loading = ref(true)
const error = ref(null)

const groups = ref([])
const groupsLoading = ref(true)
const groupsError = ref(null)

const myGroups = ref([])

const groupPostAssociations = ref([])

const firstThreeGroups = computed(() => groups.value.slice(0, 3))

onMounted(async () => {
  if (auth.isLoggedIn) {
    try {
      const myGroupsResponse = await fetchMyGroups()
      myGroups.value = myGroupsResponse.data.map(g => g.id)
    } catch (err) {
      console.error('Failed to fetch user groups:', err)
    }
  }

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
    
    const mappedPosts = response.data.map(post => {
      const association = groupPostAssociations.value.find(assoc => assoc.postId === post.id)
      return {
        id: post.id,
        title: post.title,
        content: post.body,
        icon: association && groupsEmojiMap[association.groupId] ? groupsEmojiMap[association.groupId] : '💬',
        createdAt: post.createdAt,
        sharedBy: association?.sharedBy,
        groupName: association ? groupsMap[association.groupId] : null,
        groupId: association?.groupId,
        author: association?.sharedBy
      }
    })

    if (myGroups.value.length > 0) {
      const userGroupPosts = mappedPosts.filter(post => post.groupId && myGroups.value.includes(post.groupId))
      const otherPosts = mappedPosts.filter(post => !post.groupId || !myGroups.value.includes(post.groupId))
      articles.value = [...userGroupPosts, ...otherPosts]
    } else {
      articles.value = mappedPosts
    }
  } catch (err) {
    console.error('Failed to fetch posts:', err)
    error.value = err.response?.data?.message || 'Failed to load posts. Please try again.'
  } finally {
    loading.value = false
  }

  try {
    groupsLoading.value = true
    groupsError.value = null
    
    const response = await fetchAllGroups()
    
    groups.value = response.data.map(group => ({
      ...group,
      emoji: group.emoji || '👥',
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
          <div v-if="groupsLoading" class="text-sm text-gray-500 dark:text-gray-400">
            Loading groups...
          </div>
          
          <div v-else-if="groupsError" class="text-sm text-red-500 dark:text-red-400">
            {{ groupsError }}
          </div>
          
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
      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">Loading posts...</p>
      </div>

      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-500 dark:text-red-400 mb-2">{{ error }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Please make sure you're logged in to view posts.
        </p>
      </div>

      <div v-else-if="articles.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No posts available yet.</p>
      </div>

      <PostPreviewCard
        v-else
        v-for="article in articles"
        :key="article.id"
        :post="article"
        :shared-by="article.sharedBy"
        :group-name="article.groupName"
        :author="article.author"
        variant="main"
      />
    </template>

    <template #mobile>
      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">Loading posts...</p>
      </div>

      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-500 dark:text-red-400 mb-2">{{ error }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Please make sure you're logged in to view posts.
        </p>
      </div>

      <div v-else-if="articles.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No posts available yet.</p>
      </div>

      <PostPreviewCard
        v-else
        v-for="article in articles"
        :key="article.id"
        :post="article"
        :shared-by="article.sharedBy"
        :group-name="article.groupName"
        :author="article.author"
        variant="mobile"
      />
    </template>
  </TwoColumnLayout>
</template>
