<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CardFoundationComponent from './CardFoundationComponent.vue'

const route = useRoute()
const router = useRouter()
const isProfileMenuOpen = ref(false)
const profileButtonRef = ref(null)

const navItems = [
  { name: 'home', path: '/', emoji: '🏠' },
  { name: 'posts', path: '/posts', emoji: '📝' },
  { name: 'groups', path: '/groups', emoji: '👥' },
  { name: 'profile', path: '/profile', emoji: '👤' },
]

const profileSubMenuItems = [
  { name: 'memberships', path: '/profile/memberships', emoji: '🎫' },
  { name: 'settings', path: '/profile/settings', emoji: '⚙️' },
]

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
}

const navigateToSubMenu = (path) => {
  router.push(path)
  isProfileMenuOpen.value = false
}
</script>

<template>
  <!-- Fade to dark gradient overlay -->
  <div class="fixed bottom-0 left-0 right-0 h-40 pointer-events-none z-30 fade-gradient" />

  <footer class="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full lg:w-1/3 px-4 pb-4">
    <CardFoundationComponent :show-emoji="false" variant="mobile">
      <nav class="w-full">
        <div class="flex items-center justify-around gap-2">
          <template v-for="item in navItems" :key="item.name">
            <!-- Profile button with submenu toggle -->
            <div v-if="item.name === 'profile'" class="relative">
              <!-- Profile Submenu -->
              <Transition name="submenu">
                <div v-if="isProfileMenuOpen" class="submenu-container">
                  <div class="flex flex-col gap-2">
                    <button
                      v-for="subItem in profileSubMenuItems"
                      :key="subItem.name"
                      @click="navigateToSubMenu(subItem.path)"
                      class="submenu-item flex flex-col items-center justify-center rounded-lg transition-all duration-200 hover:bg-emerald-500/10 hover:scale-105"
                      :class="{
                        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400': isActive(
                          subItem.path,
                        ),
                        'text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm':
                          !isActive(subItem.path),
                      }"
                    >
                      <span class="text-2xl">{{ subItem.emoji }}</span>
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

            <!-- Regular navigation items -->
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
              <span class="text-xs font-medium capitalize">{{ item.name }}</span>
            </router-link>
          </template>
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

.dark .submenu-item:not(.bg-emerald-500\/10) {
  border-color: rgba(255, 255, 255, 0.1);
}

/* Submenu animation */
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
    rgba(24 24 24 / 0.3) 60%,
    rgb(24 24 24) 100%
  ) !important;
}
</style>
