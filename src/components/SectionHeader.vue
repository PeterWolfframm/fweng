<template>
  <h2 :class="[titleSizeClass, 'font-bold text-emerald-500 mb-6 flex items-center gap-2']">
    <span :class="iconSizeClass">{{ icon }}</span>
    {{ title }}
  </h2>
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
  iconSize: {
    type: String,
    default: 'text-4xl'
  },
  titleSize: {
    type: String,
    default: 'text-3xl'
  }
})

const iconSizeClass = computed(() => {
  return props.iconSize
})

const titleSizeClass = computed(() => {
  return props.titleSize
})
</script>
