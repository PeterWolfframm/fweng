<script setup>
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import { useViewStore } from './stores/view'
import articles from './articles.json'

const route = useRoute()
const router = useRouter()
const viewStore = useViewStore()

const selectedArticle = computed(() => {
  const title = route.query.title
  if (!title) return null
  return articles.find((article) => article.title === title)
})

const toggleView = () => {
  if (selectedArticle.value) {
    // When viewing an article, clicking arrow goes to full-screen article list
    router.push('/')
    viewStore.setYapVisibility(false)
  } else {
    // Toggle between yap/articles and full-screen articles
    viewStore.toggleYapVisibility()
  }
}
</script>

<template>
  <!-- Persistent header that's always visible - COMPLETELY INDEPENDENT -->
  <header class="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm">
    <div class="px-4 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <!-- Logo is hidden on desktop when left column is visible -->
          <h1
            class="text-3xl lg:text-4xl font-bold"
            :class="{ 'lg:opacity-0 lg:pointer-events-none': viewStore.isYapVisible }"
          >
            🗣️ yap.
          </h1>
        </div>

        <!-- Text navigation button (desktop only) -->
        <div class="hidden lg:flex flex-none gap-4 items-center">
          <button
            @click="toggleView"
            class="btn btn-ghost text-base font-medium hover:opacity-70"
            :aria-label="
              selectedArticle
                ? 'View article list'
                : viewStore.isYapVisible
                  ? 'View article list'
                  : 'Go to home'
            "
          >
            {{
              selectedArticle ? 'article list' : viewStore.isYapVisible ? 'article list' : 'home'
            }}
          </button>
          <ThemeSwitcher />
        </div>

        <!-- Theme switcher only on mobile -->
        <div class="flex-none lg:hidden">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  </header>

  <!-- Main content area with padding-top to account for fixed header -->
  <div class="pt-20">
    <RouterView />
  </div>
</template>

<style scoped></style>
