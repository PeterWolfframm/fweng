<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

// Form data for profile information
const email = ref('')
const username = ref('')

// UI state
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

// Load current user data
onMounted(async () => {
  if (auth.isLoggedIn && auth.currentUser) {
    username.value = auth.currentUser.username || ''
    // In a real app, you'd fetch full user details from the backend
  }
})

// Handle profile update
const updateProfile = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    // Simulate API call - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    successMessage.value = 'Profile updated successfully!'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    errorMessage.value = error.message || 'Failed to update profile'
  } finally {
    isLoading.value = false
  }
}

// Handle logout
const handleLogout = () => {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <main class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <!-- Desktop Layout -->
    <div class="hidden lg:block w-full min-h-screen">
      <div class="max-w-6xl mx-auto p-8">
        <!-- Page Header -->
        <div class="mb-12">
          <h1 class="text-5xl font-bold text-emerald-500 mb-3">Profile Settings</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Manage your account information and preferences
          </p>
        </div>

        <div class="space-y-6">
          <!-- Profile Information Card -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 shadow-lg hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300"
          >
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-emerald-500 mb-2 flex items-center gap-2">
                <span class="text-3xl">👤</span>
                Profile Information
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Update your personal details and contact information
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

            <form @submit.prevent="updateProfile" class="space-y-6">
              <!-- Username -->
              <div>
                <label class="block text-sm font-medium mb-2 text-emerald-500">
                  Username
                </label>
                <input
                  v-model="username"
                  type="text"
                  placeholder="@username"
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 hover:border-emerald-400"
                />
              </div>

              <!-- Email Address -->
              <div>
                <label class="block text-sm font-medium mb-2 text-emerald-500">
                  Email Address
                </label>
                <input
                  v-model="email"
                  type="email"
                  placeholder="your.email@example.com"
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 hover:border-emerald-400"
                />
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-4 pt-4">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="flex-1 px-6 py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="!isLoading">💾 Save Changes</span>
                  <span v-else>Saving...</span>
                </button>
                <button
                  type="button"
                  class="px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <!-- Account & Security Card -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 shadow-lg hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300"
          >
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-emerald-500 mb-2 flex items-center gap-2">
                <span class="text-3xl">🔐</span>
                Account & Security
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Manage your account security and session
              </p>
            </div>

            <!-- Logout Button -->
            <div class="flex items-center justify-between p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700">
              <div>
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Sign Out
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  End your current session and return to the home page
                </p>
              </div>
              <button
                @click="handleLogout"
                class="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-500/30 whitespace-nowrap"
              >
                🚪 Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Layout -->
    <div class="lg:hidden p-6 pb-24">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-emerald-500 mb-2">Profile Settings</h1>
        <p class="text-base text-gray-600 dark:text-gray-400">
          Manage your account information
        </p>
      </div>

      <div class="space-y-6">
        <!-- Profile Information Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg"
        >
          <div class="mb-6">
            <h2 class="text-xl font-bold text-emerald-500 mb-2 flex items-center gap-2">
              <span class="text-2xl">👤</span>
              Profile Information
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

          <form @submit.prevent="updateProfile" class="space-y-4">
            <!-- Username -->
            <div>
              <label class="block text-sm font-medium mb-2 text-emerald-500">
                Username
              </label>
              <input
                v-model="username"
                type="text"
                placeholder="@username"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
              />
            </div>

            <!-- Email Address -->
            <div>
              <label class="block text-sm font-medium mb-2 text-emerald-500">
                Email Address
              </label>
              <input
                v-model="email"
                type="email"
                placeholder="your.email@example.com"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
              />
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full px-6 py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50"
              >
                <span v-if="!isLoading">💾 Save Changes</span>
                <span v-else>Saving...</span>
              </button>
              <button
                type="button"
                class="w-full px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-emerald-400 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Account & Security Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg"
        >
          <div class="mb-6">
            <h2 class="text-xl font-bold text-emerald-500 mb-2 flex items-center gap-2">
              <span class="text-2xl">🔐</span>
              Account & Security
            </h2>
          </div>

          <!-- Logout Button -->
          <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700">
            <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Sign Out
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              End your current session
            </p>
            <button
              @click="handleLogout"
              class="w-full px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-500/30"
            >
              🚪 Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
