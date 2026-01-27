<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import StickyFooter from './components/StickyFooter.vue'

import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const handleUnauthorized = () => {
  if (auth.isLoggedIn) {
    auth.logout()
  }
  if (route.path.startsWith('/profile')) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
  }
}

onMounted(() => {
  window.addEventListener('auth:unauthorized', handleUnauthorized)

  if (auth.validateSession() && auth.isLoggedIn) {
    auth.fetchCurrentUser()
  }
})

onUnmounted(() => {
  window.removeEventListener('auth:unauthorized', handleUnauthorized)
})

const isHome = computed(() => route.path === '/')
const isArticles = computed(() => route.path.startsWith('/posts'))

const hanldeLogout = () => {
  auth.logout()
  router.push('/')
}

const currentUser = computed(() => auth.currentUser)

const navigationLabel = computed(() => {
  if (isHome.value) return 'posts'
  if (isArticles.value) return 'home'
  return 'home'
})

const handleNavigation = () => {
  if (isHome.value) {
    router.push('/posts')
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="pb-20">
    <RouterView />
  </div>

  <StickyFooter />
</template>
