<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg">
    <h3 :class="[titleSizeClass, 'font-bold text-emerald-500 mb-4']">Edit Post</h3>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2 text-emerald-500">
          Title
        </label>
        <input
          v-model="localTitle"
          type="text"
          placeholder="Enter post title..."
          class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2 text-emerald-500">
          Body
        </label>
        <textarea
          v-model="localBody"
          :rows="rows"
          placeholder="Write your post content..."
          class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all resize-vertical"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2 text-emerald-500">
          Visibility
        </label>
        <select
          v-model="localVisibility"
          class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
        >
          <option value="PUBLIC">🌍 Public</option>
          <option value="PRIVATE">🔒 Private</option>
        </select>
      </div>

      <div :class="buttonContainerClass" class="pt-2">
        <button
          type="submit"
          :disabled="isUpdating"
          :class="[submitButtonClass, 'bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50']"
        >
          <span v-if="!isUpdating">💾 Save Changes</span>
          <span v-else>Saving...</span>
        </button>
        <button
          type="button"
          @click="$emit('cancel')"
          :class="cancelButtonClass"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  postId: {
    type: [Number, String],
    required: true
  },
  initialTitle: {
    type: String,
    required: true
  },
  initialBody: {
    type: String,
    required: true
  },
  initialVisibility: {
    type: String,
    default: 'PUBLIC'
  },
  isUpdating: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'desktop',
    validator: (value) => ['desktop', 'mobile'].includes(value)
  }
})

const localTitle = ref(props.initialTitle)
const localBody = ref(props.initialBody)
const localVisibility = ref(props.initialVisibility)

watch(() => props.initialTitle, (newVal) => {
  localTitle.value = newVal
})
watch(() => props.initialBody, (newVal) => {
  localBody.value = newVal
})
watch(() => props.initialVisibility, (newVal) => {
  localVisibility.value = newVal
})

const titleSizeClass = computed(() => {
  return props.variant === 'mobile' ? 'text-base' : 'text-lg'
})

const rows = computed(() => {
  return props.variant === 'mobile' ? 5 : 6
})

const buttonContainerClass = computed(() => {
  return props.variant === 'mobile' ? 'flex flex-col gap-2' : 'flex gap-3'
})

const submitButtonClass = computed(() => {
  return props.variant === 'mobile' 
    ? 'w-full px-4 py-3 rounded-xl text-sm' 
    : 'flex-1 px-4 py-3 rounded-xl'
})

const cancelButtonClass = computed(() => {
  return props.variant === 'mobile'
    ? 'w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-emerald-400 transition-all font-medium text-sm'
    : 'px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-emerald-400 transition-all font-medium'
})

const emit = defineEmits(['update', 'cancel'])

const handleSubmit = () => {
  emit('update', {
    postId: props.postId,
    title: localTitle.value.trim(),
    body: localBody.value.trim(),
    visibility: localVisibility.value
  })
}
</script>
