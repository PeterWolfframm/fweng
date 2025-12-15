<script setup>
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import ThemeSwitcher from './components/ThemeSwitcher.vue'

const route = useRoute()
const router = useRouter()

const isHome = computed(() => route.path === '/')
const isArticles = computed(() => route.path.startsWith('/posts'))

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

          <router-link to="/profile" class="btn btn-ghost text-base font-medium">profile</router-link>
          <router-link to="/groups" class="btn btn-ghost text-base font-medium">groups</router-link>
          <router-link to="/users" class="btn btn-ghost text-base font-medium">users</router-link>
          <router-link to="/imprint" class="btn btn-ghost text-base font-medium">imprint</router-link>
          <router-link to="/help" class="btn btn-ghost text-base font-medium">help</router-link>
          <router-link to="/login" class="btn btn-ghost text-base font-medium hover:opacity-70">
            Login
          </router-link>

          <router-link to="/register" class="btn btn-primary text-base font-medium">
            Register
          </router-link>

        </div>

        <div class="flex-none lg:hidden flex items-center gap-2">
          <router-link to="/login" class="btn btn-ghost btn-sm">Login</router-link>
          <router-link to="/register" class="btn btn-primary btn-sm">Registrieren</router-link>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  </header>

  <div class="pt-20">
    <RouterView />
  </div>
</template>
