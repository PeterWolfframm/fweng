<script setup>
defineProps({
  maxWidth: {
    type: String,
    default: '4xl',
  },
})
</script>

<template>
  <div class="w-full max-w-4xl mx-auto">
    <div class="w-full min-h-0">
      <slot></slot>
    </div>
  </div>
</template>

