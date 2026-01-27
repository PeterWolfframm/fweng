<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg">
    <PostPreviewCard
      :post="post"
      :group-name="currentGroupName"
      :variant="variant"
    />
    
    <!-- Group Change UI -->
    <GroupChangeUI
      :post-id="post.id"
      :current-group-id="currentGroupId"
      :current-group-name="currentGroupName"
      :available-groups="availableGroups"
      :is-changing="isChangingGroup"
      :is-changing-group="isChangingGroupInProgress"
      :is-loading-group-posts="isLoadingGroupPosts"
      :model-value="selectedGroupId"
      :variant="variant === 'mobile' ? 'mobile' : 'desktop'"
      @update:model-value="$emit('update:selectedGroupId', $event)"
      @save="$emit('saveGroupChange')"
      @cancel="$emit('cancelGroupChange')"
    />
    
    <!-- Action Buttons -->
    <div :class="actionButtonsClass" class="mt-4">
      <button
        @click="$emit('edit')"
        :class="actionButtonClass"
      >
        ✏️ Edit
      </button>
      <button
        v-if="!isChangingGroup"
        @click="$emit('changeGroup')"
        :class="[actionButtonClass, 'bg-purple-500 hover:bg-purple-600']"
      >
        👫 Change Group
      </button>
      <button
        @click="$emit('delete')"
        :disabled="isDeletingPost"
        :class="[actionButtonClass, 'bg-red-500 hover:bg-red-600 disabled:opacity-50']"
      >
        <span v-if="isDeletingPost">Deleting...</span>
        <span v-else>🗑️ Delete</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PostPreviewCard from './PostPreviewCard.vue'
import GroupChangeUI from './GroupChangeUI.vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  variant: {
    type: String,
    default: 'main',
    validator: (value) => ['main', 'mobile'].includes(value)
  },
  availableGroups: {
    type: Array,
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
  isLoadingGroupPosts: {
    type: Boolean,
    default: false
  },
  isChangingGroup: {
    type: Boolean,
    default: false
  },
  isChangingGroupInProgress: {
    type: Boolean,
    default: false
  },
  isDeletingPost: {
    type: Boolean,
    default: false
  },
  selectedGroupId: {
    type: [String, Number],
    default: ''
  }
})

const actionButtonsClass = computed(() => {
  return props.variant === 'mobile' ? 'flex gap-2' : 'flex gap-2'
})

const actionButtonClass = computed(() => {
  const base = 'text-sm font-medium active:scale-95 transition-all'
  const size = props.variant === 'mobile' 
    ? 'flex-1 px-3 py-2 rounded-lg' 
    : 'px-4 py-2 rounded-lg'
  const color = 'bg-blue-500 text-white hover:bg-blue-600'
  return `${base} ${size} ${color}`
})

defineEmits(['edit', 'delete', 'changeGroup', 'saveGroupChange', 'cancelGroupChange', 'update:selectedGroupId'])
</script>
