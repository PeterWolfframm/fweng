<script setup>
import CardFoundationComponent from './CardFoundationComponent.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  group: {
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
})

const router = useRouter()

const navigateToGroup = () => {
  router.push(`/groups/${encodeURIComponent(props.group.name)}`)
}
</script>

<template>
  <CardFoundationComponent
    :is-active="isActive"
    :variant="variant"
    :content-class="contentClass"
    @click="navigateToGroup"
  >
    <template #emoji>
      {{ group.icon }}
    </template>
    <h3 class="text-xl font-medium mb-1.5 text-emerald-500 group-hover:text-emerald-600">
      {{ group.name }}
    </h3>
    <div :class="contentClass" class="text-sm opacity-70" v-html="group.description"></div>
  </CardFoundationComponent>
</template>
