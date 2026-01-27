<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="p-6 rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
    <div class="flex items-center gap-4">
      <div
        class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/30"
      >
        {{ authStore.currentUser?.username?.charAt(0).toUpperCase() }}
      </div>
      <div>
        <h1 class="text-2xl font-bold">{{ authStore.currentUser?.username }}</h1>
        <p class="text-emerald-100 text-sm">{{ authStore.currentUser?.email }}</p>
      </div>
    </div>
  </div>
</template>

