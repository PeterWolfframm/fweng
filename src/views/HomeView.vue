<script setup>
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main class="flex h-screen w-full overflow-hidden">
    <!-- Left Section - Sticky and Centered -->
    <div class="w-1/2 flex items-center justify-center bg-transparent">
      <div class="text-center">
        <h1 class="text-6xl font-bold mb-4">🗣️ yap.</h1>
        <p class="text-lg opacity-70">Scroll to explore</p>
      </div>
    </div>
    
    <!-- Right Section - Scrollable -->
    <div class="w-1/2 overflow-y-auto h-screen p-8">
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
