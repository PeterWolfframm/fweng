<template>
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div 
      v-if="message"
      class="w-full p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 shadow-sm"
      role="alert"
    >
      <div class="flex items-start gap-3">
        <!-- Error Icon -->
        <svg 
          class="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path 
            fill-rule="evenodd" 
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" 
            clip-rule="evenodd" 
          />
        </svg>
        
        <!-- Error Message -->
        <div class="flex-1">
          <p class="text-sm font-medium text-red-600 dark:text-red-400">
            {{ message }}
          </p>
        </div>
        
        <!-- Close Button (optional) -->
        <button
          v-if="dismissible"
          @click="$emit('dismiss')"
          class="shrink-0 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
          aria-label="Dismiss error"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path 
              fill-rule="evenodd" 
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
              clip-rule="evenodd" 
            />
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  },
  dismissible: {
    type: Boolean,
    default: false
  }
})

defineEmits(['dismiss'])
</script>
