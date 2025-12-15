<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import EmojiContainer from './EmojiContainer.vue'

const authStore = useAuthStore()

const props = defineProps({
  variant: {
    type: String,
    default: 'main',
    validator: (value) => ['sidebar', 'main', 'mobile'].includes(value),
  },
})

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

const getBaseClasses = () => {
  const base =
    'relative p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-sm hover:border-emerald-500 hover:shadow-[0_8px_16px_rgba(16,185,129,0.2)] transition-all'

  const variantClasses = {
    sidebar:
      "mt-8 lg:mt-0 lg:py-6 lg:px-4 lg:pl-20 before:content-[''] before:border-l before:border-gray-300 dark:before:border-gray-700 before:absolute before:left-0 before:bottom-[calc(50%+25px)] before:h-[calc(50%-25px)] before:hidden before:lg:block after:content-[''] after:border-l after:border-gray-300 dark:after:border-gray-700 after:absolute after:left-0 after:top-[calc(50%+25px)] after:h-[calc(50%-25px)] after:hidden after:lg:block first:before:hidden! last:after:hidden!",
    main: "mt-8 lg:mt-0 lg:py-6 lg:px-4 lg:pl-20 before:content-[''] before:border-l before:border-gray-300 dark:before:border-gray-700 before:absolute before:left-0 before:bottom-[calc(50%+25px)] before:h-[calc(50%-25px)] before:hidden before:lg:block after:content-[''] after:border-l after:border-gray-300 dark:after:border-gray-700 after:absolute after:left-0 after:top-[calc(50%+25px)] after:h-[calc(50%-25px)] after:hidden after:lg:block first:before:hidden! last:after:hidden!",
    mobile: 'mt-8',
  }

  return `${base} ${variantClasses[props.variant]}`
}

defineExpose({
  formData,
})
</script>

<template>
  <div :class="getBaseClasses()">
    <EmojiContainer>
      👤
    </EmojiContainer>
    <div class="flex-1 ml-4">
      <h2 class="text-xl font-medium mb-4 text-emerald-500">
        Basic Information
      </h2>

      <div class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-semibold mb-2 opacity-70">
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
          <label for="email" class="block text-sm font-semibold mb-2 opacity-70">
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
  </div>
</template>

