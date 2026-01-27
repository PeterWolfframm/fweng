<script setup>
import { defineProps } from 'vue'
import EmojiContainer from './EmojiContainer.vue'

defineProps({
  post: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.id && value.title && value.content && value.icon
    }
  }
})

defineEmits(['click'])
</script>

<template>
  <div
    @click="$emit('click')"
    class="group flex relative p-4 rounded-xl border-2 border-transparent cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500 hover:shadow-[0_8px_16px_rgba(16,185,129,0.2)] transition-all duration-200"
  >
    <EmojiContainer>
      {{ post.icon }}
    </EmojiContainer>
    <div class="flex-1 ml-4">
      <h3 class="text-xl font-medium mb-1.5 text-emerald-500 group-hover:text-emerald-600">
        {{ post.title }}
      </h3>
      <p class="text-sm opacity-70 line-clamp-2">
        {{ post.content }}
      </p>
    </div>
  </div>
</template>

