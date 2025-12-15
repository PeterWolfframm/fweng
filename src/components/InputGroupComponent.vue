<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const formData = ref({
  username: authStore.currentUser?.username || '',
  email: authStore.currentUser?.email || '',
})

const emit = defineEmits(['update'])

const handleInput = () => {
  emit('update', {
    username: formData.value.username,
    email: formData.value.email,
  })
}

defineExpose({
  formData,
})
</script>

<template>
  <div
    class="p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-sm"
  >
    <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
      <span>👤</span>
      Basic Information
    </h2>

    <div class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-semibold mb-2">
          Username
        </label>
        <input
          id="username"
          v-model="formData.username"
          @input="handleInput"
          type="text"
          class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
          placeholder="Enter username"
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-semibold mb-2">
          Email Address
        </label>
        <input
          id="email"
          v-model="formData.email"
          @input="handleInput"
          type="email"
          class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
          placeholder="Enter email"
        />
      </div>
    </div>
  </div>
</template>

