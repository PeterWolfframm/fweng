<script setup>
import CardFoundationComponent from './CardFoundationComponent.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  post: {
    type: Object,
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

const router = useRouter()

const navigateToPost = () => {
  router.push(`/posts/${encodeURIComponent(props.post.title)}`)
}
</script>

<template>
  <div @click="navigateToPost">
    <CardFoundationComponent :is-active="isActive" :variant="variant" :content-class="contentClass" :show-emoji="showEmoji">
      <template #emoji>
        {{ post.icon }}
      </template>
      <h3 class="text-xl font-medium mb-1.5 text-emerald-500 group-hover:text-emerald-600">
        {{ post.title }}
      </h3>
      <div :class="contentClass" v-html="post.content"></div>
    </CardFoundationComponent>
  </div>
</template>
