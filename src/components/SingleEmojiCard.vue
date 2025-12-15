<script setup>
import CardFoundationComponent from './CardFoundationComponent.vue'

const props = defineProps({
  emoji: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'main',
    validator: (value) => ['sidebar', 'main', 'mobile'].includes(value),
  },
  contentClass: {
    type: String,
    default: '',
  },
  showEmoji: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <div>
    <CardFoundationComponent
      :is-active="isActive"
      :variant="variant"
      :content-class="contentClass"
      :show-emoji="showEmoji"
    >
      <template #emoji>
        {{ emoji }}
      </template>
      <div class="flex items-center justify-center min-h-[60px]">
        <!-- Emoji displayed in container above -->
      </div>
    </CardFoundationComponent>
  </div>
</template>
