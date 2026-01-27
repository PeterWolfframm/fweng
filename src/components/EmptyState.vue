<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-12 text-center shadow-lg">
    <span :class="iconSizeClass" class="mb-4 block">{{ icon }}</span>
    <p :class="titleSizeClass" class="text-gray-600 dark:text-gray-400 mb-2">{{ title }}</p>
    <p class="text-sm text-gray-500 dark:text-gray-500">{{ description }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  iconSize: {
    type: String,
    default: 'text-6xl'
  },
  titleSize: {
    type: String,
    default: 'text-xl'
  }
})

const iconSizeClass = computed(() => {
  return props.iconSize
})

const titleSizeClass = computed(() => {
  return props.titleSize
})
</script>
