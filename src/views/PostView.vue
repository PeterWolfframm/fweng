<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PostPreviewCard from '../components/PostPreviewCard.vue'
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
  <main class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <div v-if="currentPost" class="hidden lg:flex w-full h-[calc(100vh-5rem)]">
      <aside class="w-1/3 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
        <div class="w-full p-8">
          <PostPreviewCard
            v-for="post in posts"
            :key="post.id"
            :post="post"
            :isActive="currentPost && currentPost.title === post.title"
            variant="sidebar"
            contentClass="text-sm opacity-70"
          />
        </div>
      </aside>

      <div class="flex-1 w-2/3 overflow-y-auto">
        <div class="p-8">
          <div class="post-content max-w-4xl">
            <h1 class="text-5xl font-bold mb-8">{{ currentPost.title }}</h1>
            <div class="text-xl leading-relaxed opacity-80" v-html="currentPost.content"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="hidden lg:block w-full">
      <div class="p-8 max-w-7xl mx-auto">
        <PostPreviewCard v-for="post in posts" :key="post.id" :post="post" variant="main" />
      </div>
    </div>

    <div class="lg:hidden p-6">
      <div v-if="currentPost" class="post-content">
        <button
          @click="router.push('/posts')"
          class="mb-6 text-emerald-500 hover:opacity-70 flex items-center gap-2"
        >
          ← Back to Posts
        </button>
        <h1 class="text-4xl font-bold mb-6">{{ currentPost.title }}</h1>
        <div class="text-lg leading-relaxed opacity-80" v-html="currentPost.content"></div>
      </div>
      <div v-else>
        <PostPreviewCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          variant="mobile"
          contentClass="text-sm opacity-70"
        />
      </div>
    </div>
  </main>
</template>
