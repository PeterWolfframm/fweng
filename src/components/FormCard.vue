<template>
  <div
    :class="[
      'bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300',
      paddingClass
    ]"
  >
    <div class="mb-6">
      <h2 :class="[titleSizeClass, 'font-bold text-emerald-500 mb-2 flex items-center gap-2']">
        <span :class="iconSizeClass">{{ icon }}</span>
        {{ title }}
      </h2>
      <p v-if="description" :class="descriptionSizeClass" class="text-gray-600 dark:text-gray-400">
        {{ description }}
      </p>
    </div>

    <SuccessMessage v-if="successMessage" :message="successMessage" class="mb-6" />
    <ErrorDisplayComponent v-if="errorMessage" :message="errorMessage" class="mb-6" />

    <form @submit.prevent="$emit('submit')" :class="formClass">
      <slot></slot>
      <div v-if="$slots.actions" :class="actionsClass">
        <slot name="actions"></slot>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SuccessMessage from './SuccessMessage.vue'
import ErrorDisplayComponent from './ErrorDisplayComponent.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  successMessage: {
    type: String,
    default: ''
  },
  errorMessage: {
    type: String,
    default: ''
  },
  iconSize: {
    type: String,
    default: 'text-3xl'
  },
  titleSize: {
    type: String,
    default: 'text-2xl'
  },
  descriptionSize: {
    type: String,
    default: 'text-sm'
  },
  variant: {
    type: String,
    default: 'desktop',
    validator: (value) => ['desktop', 'mobile'].includes(value)
  }
})

const iconSizeClass = computed(() => props.iconSize)
const titleSizeClass = computed(() => props.titleSize)
const descriptionSizeClass = computed(() => props.descriptionSize)
const paddingClass = computed(() => {
  return props.variant === 'mobile' ? 'p-6' : 'p-8'
})
const formClass = computed(() => {
  return props.variant === 'mobile' ? 'space-y-4' : 'space-y-6'
})
const actionsClass = computed(() => {
  return props.variant === 'mobile' ? 'flex flex-col gap-3 pt-2' : 'flex gap-4 pt-4'
})

defineEmits(['submit'])
</script>
