<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TheWelcome from '../components/TheWelcome.vue'
import articles from '../articles.json'
import { useViewStore } from '../stores/view'

const route = useRoute()
const viewStore = useViewStore()

const selectedArticle = computed(() => {
  const title = route.query.title
  if (!title) return null
  return articles.find((article) => article.title === title)
})
</script>

<template>
  <main class="relative w-full">
    <!-- Desktop Layout -->
    <div class="hidden lg:flex w-full h-[calc(100vh-5rem)]">
      <!-- Left Panel: Yap branding OR Article list (when article is selected) -->
      <aside
        :class="[
          'sticky top-[5rem] h-[calc(100vh-5rem)] overflow-y-auto',
          selectedArticle ? 'w-1/3' : viewStore.isYapVisible ? 'w-1/3' : 'w-0 overflow-hidden',
        ]"
      >
        <!-- Show article list when an article is selected -->
        <div v-if="selectedArticle" class="w-full p-8">
          <TheWelcome />
        </div>

        <!-- Show yap branding when no article is selected -->
        <div v-else class="w-full px-8 pt-8" :class="{ 'opacity-0': !viewStore.isYapVisible }">
          <h1 class="text-6xl font-bold mb-4">🗣️ yap.</h1>
          <p class="text-lg opacity-70">Scroll to explore</p>
        </div>
      </aside>

      <!-- Main content area -->
      <div
        :class="[
          'flex-1 overflow-y-auto',
          selectedArticle ? 'w-2/3' : viewStore.isYapVisible ? 'w-2/3' : 'w-full',
        ]"
      >
        <!-- Content area -->
        <div class="p-8">
          <!-- Article content view -->
          <div v-if="selectedArticle" class="article-content max-w-4xl">
            <h1 class="text-5xl font-bold mb-8">{{ selectedArticle.title }}</h1>
            <div class="text-xl leading-relaxed opacity-80" v-html="selectedArticle.content"></div>
          </div>
          <!-- Article list view -->
          <TheWelcome v-else />
        </div>
      </div>
    </div>

    <!-- Mobile Layout -->
    <div class="lg:hidden p-6">
      <div v-if="selectedArticle" class="article-content">
        <h1 class="text-4xl font-bold mb-6">{{ selectedArticle.title }}</h1>
        <div class="text-lg leading-relaxed opacity-80" v-html="selectedArticle.content"></div>
      </div>
      <TheWelcome v-else />
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}
</style>
