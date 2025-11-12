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
    <!-- Mobile Sticky Navbar (visible only on mobile) -->
    <div class="lg:hidden sticky top-0 z-50 bg-base-100 shadow-md">
      <div class="navbar">
        <div class="flex-1 justify-center">
          <h1 class="text-4xl font-bold">🗣️ yap.</h1>
        </div>
      </div>
    </div>

    <!-- Desktop Layout (visible only on large screens) -->
    <div class="hidden lg:flex w-full min-h-screen">
      <!-- Left Sidebar -->
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

      <!-- Right Content Area -->
      <div
        :class="[
          'transition-all duration-300 ease-in-out min-h-screen relative',
          isSidebarOpen ? 'w-2/3' : 'w-full',
        ]"
      >
        <!-- Toggle Button -->
        <button
          @click="toggleSidebar"
          class="btn btn-circle btn-ghost absolute top-4 left-4 z-10"
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

        <!-- Scrollable Content -->
        <div class="p-8 pt-20">
          <TheWelcome />
        </div>
      </div>
    </div>

    <!-- Mobile Content (visible only on mobile) -->
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
