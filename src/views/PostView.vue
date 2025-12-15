<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TwoColumnLayout from '../components/TwoColumnLayout.vue'
import PostPreviewCard from '../components/PostPreviewCard.vue'
import DetailHeader from '../components/DetailHeader.vue'
import posts from '../posts.json'

const route = useRoute()
const router = useRouter()

const currentPost = computed(() => {
  const title = route.params.title
  if (!title) return null
  return posts.find((post) => post.title === title)
})
</script>

<template>
  <TwoColumnLayout v-if="currentPost">
    <template #sidebar>
      <PostPreviewCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        :isActive="currentPost && currentPost.title === post.title"
        variant="sidebar"
        contentClass="text-sm opacity-70"
      />
    </template>

    <template #main>
      <DetailHeader :title="currentPost.title" :description="currentPost.content" variant="main" />
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
      </div>
    </template>
  </TwoColumnLayout>

  <main v-else class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <div class="hidden lg:block w-full">
      <div class="p-8 max-w-7xl mx-auto">
        <PostPreviewCard v-for="post in posts" :key="post.id" :post="post" variant="main" />
      </div>
    </div>

    <div class="lg:hidden p-6">
      <PostPreviewCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        variant="mobile"
        contentClass="text-sm opacity-70"
      />
    </div>
  </main>
</template>
