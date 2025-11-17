<script setup>
import { ref } from 'vue'
import TheWelcome from '../components/TheWelcome.vue'

const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <main class="relative w-full min-h-screen">
    <div class="lg:hidden sticky top-0 z-50 bg-transparent backdrop-blur-sm">
      <div class="navbar">
        <div class="flex-1 justify-center">
          <h1 class="text-4xl font-bold">🗣️ yap.</h1>
        </div>
      </div>
    </div>

    <div class="hidden lg:flex w-full min-h-screen">
      <aside
        :class="[
          'sticky top-0 h-screen flex items-center justify-center transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'w-1/3' : 'w-0',
        ]"
        :aria-hidden="!isSidebarOpen"
      >
        <div
          :class="[
            'text-center transition-opacity duration-300',
            isSidebarOpen ? 'opacity-100' : 'opacity-0',
          ]"
        >
          <h1 class="text-6xl font-bold mb-4">🗣️ yap.</h1>
          <p class="text-lg opacity-70">Scroll to explore</p>
        </div>
      </aside>
      <div
        :class="[
          'transition-all duration-300 ease-in-out min-h-screen relative',
          isSidebarOpen ? 'w-2/3' : 'w-full',
        ]"
      >
        <div class="sticky top-0 z-10 bg-transparent backdrop-blur-sm px-8 py-4 flex items-center gap-4">
          <button
            @click="toggleSidebar"
            class="btn btn-circle btn-ghost flex-shrink-0"
            :aria-label="isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'"
            :aria-expanded="isSidebarOpen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 transition-transform duration-300"
              :class="{ 'rotate-180': !isSidebarOpen }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 v-if="!isSidebarOpen" class="text-3xl font-bold transition-opacity duration-300 flex-1">🗣️ yap.</h1>
        </div>
        <div class="p-8">
          <TheWelcome />
        </div>
      </div>
    </div>
    <div class="lg:hidden p-6">
      <TheWelcome />
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 0;
  margin: 0;
  width: 100vw;
}
</style>
