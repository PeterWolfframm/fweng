<template>
  <div v-if="show" class="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
    <div :class="containerClass">
      <span :class="labelClass">Add Member:</span>
      <select
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :disabled="isLoadingUsers || isAdding"
        :class="selectClass"
      >
        <option value="">Select a user...</option>
        <option v-for="user in allUsers" :key="user.id" :value="user.id">
          {{ user.username }} ({{ user.email }})
        </option>
      </select>
      <button
        @click="$emit('addMember')"
        :disabled="!modelValue || isAdding"
        :class="buttonClass"
      >
        <span v-if="isAdding">Adding...</span>
        <span v-else>{{ buttonText }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  groupId: {
    type: [Number, String],
    required: true
  },
  allUsers: {
    type: Array,
    required: true
  },
  isLoadingUsers: {
    type: Boolean,
    default: false
  },
  isAdding: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  show: {
    type: Boolean,
    default: true
  },
  variant: {
    type: String,
    default: 'desktop',
    validator: (value) => ['desktop', 'mobile'].includes(value)
  }
})

const containerClass = computed(() => {
  return props.variant === 'mobile' 
    ? 'space-y-3' 
    : 'flex items-center gap-3'
})

const labelClass = computed(() => {
  return props.variant === 'mobile'
    ? 'block text-sm font-medium text-gray-700 dark:text-gray-300'
    : 'text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap'
})

const selectClass = computed(() => {
  const base = 'px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 transition-all text-sm'
  return props.variant === 'mobile' 
    ? `w-full ${base}` 
    : `flex-1 ${base}`
})

const buttonClass = computed(() => {
  const base = 'px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm'
  return props.variant === 'mobile'
    ? `w-full ${base}`
    : `${base} whitespace-nowrap`
})

const buttonText = computed(() => {
  return props.variant === 'mobile' ? '➕ Add Member' : '➕ Add'
})

defineEmits(['update:modelValue', 'addMember'])
</script>
