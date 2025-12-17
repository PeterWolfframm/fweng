<script setup>
import { useRoute } from 'vue-router'
import CardFoundationComponent from './CardFoundationComponent.vue'

const route = useRoute()

const navItems = [
  { name: 'home', path: '/', emoji: '🏠' },
  { name: 'posts', path: '/posts', emoji: '📝' },
  { name: 'groups', path: '/groups', emoji: '👥' },
  { name: 'profile', path: '/profile', emoji: '👤' },
]

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <!-- Fade to dark gradient overlay -->
  <div class="fixed bottom-0 left-0 right-0 h-40 pointer-events-none z-30 fade-gradient" />

  <footer class="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full lg:w-1/3 px-4 pb-4">
    <CardFoundationComponent :show-emoji="false" variant="mobile">
      <nav class="w-full">
        <div class="flex items-center justify-around gap-2">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            class="flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 hover:bg-emerald-500/10 hover:scale-105 min-w-[60px]"
            :class="{
              'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400': isActive(item.path),
              'text-gray-600 dark:text-gray-400': !isActive(item.path),
            }"
          >
            <span class="text-2xl mb-1">{{ item.emoji }}</span>
            <span class="text-xs font-medium capitalize">{{ item.name }}</span>
          </router-link>
        </div>
      </nav>
    </CardFoundationComponent>
  </footer>
</template>

<style scoped>
.fade-gradient {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255 255 255 / 0.3) 60%,
    rgb(255 255 255) 100%
  );
}
</style>

<style>
.dark .fade-gradient {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(24 24 24 / 0.3) 60%,
    rgb(24 24 24) 100%
  ) !important;
}
</style>
