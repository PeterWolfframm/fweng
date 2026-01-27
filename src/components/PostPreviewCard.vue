<script setup>
import CardFoundationComponent from './CardFoundationComponent.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  sharedBy: {
    type: String,
    default: null,
  },
  groupName: {
    type: String,
    default: null,
  },
  author: {
    type: String,
    default: null,
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
      
      <!-- Group and User Attribution -->
      <div v-if="groupName || sharedBy || author" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-2">
        <!-- Group Badge -->
        <div v-if="groupName" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
          <span>👫</span>
          <span>{{ groupName }}</span>
        </div>
        
        <!-- Author / Shared By -->
        <div v-if="author || sharedBy" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
          <span>@{{ author || sharedBy }}</span>
        </div>
      </div>
    </CardFoundationComponent>
  </div>
</template>
