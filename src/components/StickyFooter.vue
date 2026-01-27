<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const isProfileMenuOpen = ref(false)
const profileButtonRef = ref(null)
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
}

const applyTheme = (dark, saveToStorage = true) => {
  const html = document.documentElement
  if (dark) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
  if (saveToStorage) {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
    applyTheme(isDark.value, false)
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(isDark.value, false)

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        isDark.value = e.matches
        applyTheme(e.matches, false)
      }
    })
  }
})

const navItems = [
  { name: 'yap.', path: '/', emoji: '🗣️' },
  { name: 'posts', path: '/posts', emoji: '📝' },
  { name: 'groups', path: '/groups', emoji: '👥' },
  { name: 'profile', path: '/profile', emoji: '👤' },
]

const profileSubMenuItems = [
  { name: 'overview', path: '/profile/overview', emoji: '🎫' },
  { name: 'settings', path: '/profile/settings', emoji: '⚙️' },
  { name: 'login', path: '/login', emoji: '🔐' },
  { name: 'register', path: '/register', emoji: '📝' },
  { name: 'theme', action: 'toggleTheme', emoji: 'theme' },
]

const filteredProfileSubMenuItems = computed(() => {
  if (auth.isLoggedIn) {
    return profileSubMenuItems.filter(
      item => item.name !== 'login' && item.name !== 'register'
    )
  }
  return profileSubMenuItems.filter(
    item => item.name !== 'overview' && item.name !== 'settings'
  )
})

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
}

const navigateToSubMenu = (subItem) => {
  if (subItem.action === 'toggleTheme') {
    toggleTheme()
  } else {
    router.push(subItem.path)
    isProfileMenuOpen.value = false
  }
}
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 h-64 pointer-events-none z-30 fade-gradient" />

  <footer class="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full lg:w-1/3 px-4 pb-4">
    <div
      class="glass-footer w-full p-4 rounded-xl border-2 border-white/20 dark:border-gray-700/50"
    >
      <nav class="w-full">
        <div class="flex items-center justify-around gap-2">
          <template v-for="item in navItems" :key="item.name">
            <div v-if="item.name === 'profile'" class="relative">
              <Transition name="submenu">
                <div v-if="isProfileMenuOpen" class="submenu-container">
                  <div class="flex flex-col gap-2">
                    <button
                      v-for="subItem in filteredProfileSubMenuItems"
                      :key="subItem.name"
                      @click="navigateToSubMenu(subItem)"
                      class="submenu-item flex flex-col lg:flex-row items-center justify-center lg:justify-start rounded-lg transition-all duration-200 hover:bg-emerald-500/10 hover:scale-105 lg:gap-3 lg:px-4"
                      :class="{
                        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400':
                          subItem.action !== 'toggleTheme' && isActive(subItem.path),
                        'text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm':
                          subItem.action === 'toggleTheme' || !isActive(subItem.path),
                      }"
                    >
                      <span class="text-2xl">{{
                        subItem.action === 'toggleTheme' ? (isDark ? '☀️' : '🌙') : subItem.emoji
                      }}</span>
                      <span class="hidden lg:block text-sm font-medium capitalize">{{ subItem.name }}</span>
                    </button>
                  </div>
                </div>
              </Transition>

              <button
                ref="profileButtonRef"
                @click="toggleProfileMenu"
                class="flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 hover:bg-emerald-500/10 hover:scale-105 min-w-[60px]"
                :class="{
                  'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400':
                    isActive(item.path) || isProfileMenuOpen,
                  'text-gray-600 dark:text-gray-400': !isActive(item.path) && !isProfileMenuOpen,
                }"
              >
                <span class="text-2xl mb-1">{{ item.emoji }}</span>
                <span class="text-xs font-medium capitalize">{{ item.name }}</span>
              </button>
            </div>

            <router-link
              v-else
              :to="item.path"
              class="flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 hover:bg-emerald-500/10 hover:scale-105 min-w-[60px]"
              :class="{
                'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400': isActive(item.path),
                'text-gray-600 dark:text-gray-400': !isActive(item.path),
              }"
            >
              <span class="text-2xl mb-1">{{ item.emoji }}</span>
              <span class="text-xs font-medium" :class="{ capitalize: item.name !== 'yap.' }">{{
                item.name
              }}</span>
            </router-link>
          </template>
        </div>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.fade-gradient {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 30%,
    rgba(255, 255, 255, 0.5) 60%,
    rgba(255, 255, 255, 0.7) 100%
  );
}

.glass-footer {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 0px 32px rgba(0, 0, 0, 0.1);
}

.submenu-container {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 0.5rem;
  z-index: 50;
}

.submenu-item {
  width: 60px;
  height: 60px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

@media (min-width: 1024px) {
  .submenu-item {
    width: auto;
    min-width: 140px;
    height: 50px;
  }
}

.dark .submenu-item:not(.bg-emerald-500\/10) {
  border-color: rgba(255, 255, 255, 0.1);
}

.submenu-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.submenu-leave-active {
  transition: all 0.2s ease-in;
}

.submenu-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(20px) scale(0.9);
}

.submenu-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px) scale(0.95);
}

.submenu-enter-to,
.submenu-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1);
}
</style>

<style>
.dark .fade-gradient {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(24, 24, 24, 0.3) 30%,
    rgba(24, 24, 24, 0.5) 60%,
    rgba(24, 24, 24, 0.7) 100%
  ) !important;
}

.dark .glass-footer {
  background: rgba(24, 24, 24, 0.7);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
</style>
