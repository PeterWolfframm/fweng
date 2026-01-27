<template>
  <div v-if="!isLoadingGroupPosts" class="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
    <div class="text-sm text-gray-600 dark:text-gray-400 mb-3">
      <span class="font-medium">Current Group: </span>
      <span v-if="currentGroupName">
        {{ currentGroupName }}
      </span>
      <span v-else class="italic">No group</span>
    </div>

    <!-- Group Change UI -->
    <div v-if="isChanging" class="space-y-3">
      <select
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all text-sm"
      >
        <option value="">📝 No Group</option>
        <option v-for="group in availableGroups" :key="group.id" :value="group.id">
          👫 {{ group.name }}
        </option>
      </select>
      <div :class="buttonContainerClass">
        <button
          @click="$emit('save')"
          :disabled="isChangingGroup"
          class="flex-1 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50"
        >
          <span v-if="isChangingGroup">Updating...</span>
          <span v-else>💾 Save Group</span>
        </button>
        <button
          @click="$emit('cancel')"
          :class="cancelButtonClass"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  postId: {
    type: [Number, String],
    required: true
  },
  currentGroupId: {
    type: [String, Number],
    default: null
  },
  currentGroupName: {
    type: String,
    default: null
  },
  availableGroups: {
    type: Array,
    required: true
  },
  isChanging: {
    type: Boolean,
    default: false
  },
  isChangingGroup: {
    type: Boolean,
    default: false
  },
  isLoadingGroupPosts: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  variant: {
    type: String,
    default: 'desktop',
    validator: (value) => ['desktop', 'mobile'].includes(value)
  }
})

const buttonContainerClass = computed(() => {
  return props.variant === 'mobile' ? 'flex flex-col gap-2' : 'flex gap-2'
})

const cancelButtonClass = computed(() => {
  return props.variant === 'mobile'
    ? 'w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-emerald-400 transition-all text-sm font-medium'
    : 'px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-emerald-400 transition-all text-sm font-medium'
})

defineEmits(['update:modelValue', 'save', 'cancel'])
</script>
