<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'main',
    validator: (value) => ['main', 'mobile'].includes(value),
  },
})

const containerClasses = computed(() => {
  return props.variant === 'main' ? 'post-content max-w-4xl mb-8' : 'post-content'
})

const titleClasses = computed(() => {
  return props.variant === 'main' ? 'text-5xl font-bold mb-8' : 'text-4xl font-bold mb-6'
})

const descriptionClasses = computed(() => {
  return props.variant === 'main'
    ? 'text-xl leading-relaxed opacity-80 mb-8'
    : 'text-lg leading-relaxed opacity-80 mb-8'
})
</script>

<template>
  <div :class="containerClasses">
    <h1 :class="titleClasses">{{ title }}</h1>
    <div :class="descriptionClasses" v-html="description"></div>
  </div>
</template>
