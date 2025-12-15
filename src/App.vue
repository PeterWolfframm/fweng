<script setup>
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

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
  <header class="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm">
    <div class="px-4 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <router-link to="/">
          <h1
              class="text-3xl lg:text-4xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
              :class="{ 'lg:opacity-0 lg:pointer-events-none': isHome }"
          >
            🗣️ yap.
          </h1>
          </router-link>
        </div>

        <div class="hidden lg:flex flex-none gap-4 items-center">

          <button
            @click="handleNavigation"
            class="btn btn-ghost text-base font-medium hover:opacity-70"
            :aria-label="`Go to ${navigationLabel}`"
          >
            {{ navigationLabel }}
          </button>

          <router-link to="/groups" class="btn btn-ghost text-base font-medium">groups</router-link>
          <router-link to="/users" class="btn btn-ghost text-base font-medium" v-if="auth.isLoggedIn">users</router-link>
          <router-link to="/imprint" class="btn btn-ghost text-base font-medium">imprint</router-link>
          <router-link to="/help" class="btn btn-ghost text-base font-medium">help</router-link>
          <router-link to="/login" class="btn btn-ghost text-base font-medium hover:opacity-70" v-if="!auth.isLoggedIn">
            Login
          </router-link>

          <router-link to="/register" class="btn btn-primary text-base font-medium" v-if="!auth.isLoggedIn">
            Register
          </router-link>

        </div>
        
        <button v-if="auth.isLoggedIn" @click="hanldeLogout" class="btn btn-ghost text-base font-medium hover:opacity-70">Logout</button>
        <ThemeSwitcher />
        <button v-if="auth.isLoggedIn"><p class="text-lg text-blue-400 p-4">{{currentUser.username}}</p></button>
      </div>
    </div>
  </header>

  <div class="pt-20">
    <RouterView />
  </div>
</template>
