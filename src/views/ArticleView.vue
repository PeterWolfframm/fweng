<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import articles from '../articles.json'

const route = useRoute()

const currentArticle = computed(() => {
  const title = route.query.title
  if (!title) return null
  return articles.find((article) => article.title === title)
})
</script>

<template>
  <div v-if="currentArticle" class="article-view p-8">
    <div class="max-w-4xl">
      <h1 class="text-4xl font-bold mb-6">{{ currentArticle.title }}</h1>
      <div class="text-lg leading-relaxed opacity-80">
        {{ currentArticle.content }}
      </div>
    </div>
  </div>
  <div v-else class="article-view p-8">
    <div class="max-w-4xl">
      <h1 class="text-4xl font-bold mb-6">Article Not Found</h1>
      <p class="text-lg opacity-70">The article you're looking for doesn't exist.</p>
    </div>
  </div>
</template>

<style scoped>
.article-view {
  min-height: 100vh;
}
</style>
