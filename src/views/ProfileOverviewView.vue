<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

// Form data for create post
const postTitle = ref('')
const postBody = ref('')

// UI state
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

// Handle post creation
const createPost = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  // Validation
  if (!postTitle.value.trim()) {
    errorMessage.value = 'Please enter a title'
    return
  }
  
  if (!postBody.value.trim()) {
    errorMessage.value = 'Please enter post content'
    return
  }
  
  isLoading.value = true

  try {
    // Simulate API call - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    successMessage.value = 'Post created successfully!'
    
    // Clear form
    postTitle.value = ''
    postBody.value = ''
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    errorMessage.value = error.message || 'Failed to create post'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <!-- Desktop Layout -->
    <div class="hidden lg:block w-full min-h-screen">
      <div class="max-w-6xl mx-auto p-8">
        <!-- Page Header -->
        <div class="mb-12">
          <h1 class="text-5xl font-bold text-emerald-500 mb-3">Profile Overview</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Create new posts and manage your content
          </p>
        </div>

        <div class="space-y-6">
          <!-- Create Post Card -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 shadow-lg hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300"
          >
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-emerald-500 mb-2 flex items-center gap-2">
                <span class="text-3xl">✍️</span>
                Create Post
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Share your thoughts with the community
              </p>
            </div>

            <!-- Success/Error Messages -->
            <div v-if="successMessage" class="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-start gap-3">
              <span class="text-xl">✓</span>
              <span>{{ successMessage }}</span>
            </div>

            <div v-if="errorMessage" class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 flex items-start gap-3">
              <span class="text-xl">⚠️</span>
              <span>{{ errorMessage }}</span>
            </div>

            <form @submit.prevent="createPost" class="space-y-6">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium mb-2 text-emerald-500">
                  Title
                </label>
                <input
                  v-model="postTitle"
                  type="text"
                  placeholder="Enter post title..."
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 hover:border-emerald-400"
                />
              </div>

              <!-- Body -->
              <div>
                <label class="block text-sm font-medium mb-2 text-emerald-500">
                  Body
                </label>
                <textarea
                  v-model="postBody"
                  rows="8"
                  placeholder="Write your post content..."
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 hover:border-emerald-400 resize-vertical"
                ></textarea>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-4 pt-4">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="flex-1 px-6 py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="!isLoading">📤 Create Post</span>
                  <span v-else>Creating...</span>
                </button>
                <button
                  type="button"
                  @click="postTitle = ''; postBody = ''"
                  class="px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all font-medium"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Layout -->
    <div class="lg:hidden p-6 pb-24">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-emerald-500 mb-2">Profile Overview</h1>
        <p class="text-base text-gray-600 dark:text-gray-400">
          Create new posts and manage your content
        </p>
      </div>

      <div class="space-y-6">
        <!-- Create Post Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg"
        >
          <div class="mb-6">
            <h2 class="text-xl font-bold text-emerald-500 mb-2 flex items-center gap-2">
              <span class="text-2xl">✍️</span>
              Create Post
            </h2>
          </div>

          <!-- Success/Error Messages -->
          <div v-if="successMessage" class="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-start gap-2 text-sm">
            <span>✓</span>
            <span>{{ successMessage }}</span>
          </div>

          <div v-if="errorMessage" class="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 flex items-start gap-2 text-sm">
            <span>⚠️</span>
            <span>{{ errorMessage }}</span>
          </div>

          <form @submit.prevent="createPost" class="space-y-4">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium mb-2 text-emerald-500">
                Title
              </label>
              <input
                v-model="postTitle"
                type="text"
                placeholder="Enter post title..."
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
              />
            </div>

            <!-- Body -->
            <div>
              <label class="block text-sm font-medium mb-2 text-emerald-500">
                Body
              </label>
              <textarea
                v-model="postBody"
                rows="6"
                placeholder="Write your post content..."
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all resize-vertical"
              ></textarea>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full px-6 py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50"
              >
                <span v-if="!isLoading">📤 Create Post</span>
                <span v-else>Creating...</span>
              </button>
              <button
                type="button"
                @click="postTitle = ''; postBody = ''"
                class="w-full px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-emerald-400 transition-all font-medium"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
