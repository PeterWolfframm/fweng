<script setup>
import { RouterView } from 'vue-router'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
</script>

<template>
  <div class="relative min-h-screen">
    <!-- Fixed ThemeSwitcher in top right corner -->
    <div class="fixed top-4 right-4 z-50">
      <ThemeSwitcher />
    </div>
    <RouterView />
  </div>
</template>

<style scoped>
</style>
