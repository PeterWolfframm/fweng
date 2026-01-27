<template>
  <div class="text-center py-12">
    <p class="text-gray-600 dark:text-gray-400">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Loading...'
  }
})
</script>
