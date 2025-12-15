<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import GroupPreviewCard from '../components/GroupPreviewCard.vue'
import PostPreviewCard from '../components/PostPreviewCard.vue'
import groups from '../groups.json'
import posts from '../posts.json'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Form data for settings
const formData = ref({
  username: authStore.currentUser?.username || '',
  email: authStore.currentUser?.email || '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const errorMessage = ref('')
const successMessage = ref('')

// Get current section from route
const currentSection = computed(() => {
  return route.params.section || 'information'
})

// Navigation items
const navItems = [
  { id: 'information', label: 'Profile Information', icon: '👤' },
  { id: 'memberships', label: 'Your Memberships', icon: '🏘️' },
  { id: 'posts', label: 'Your Posts', icon: '📝' },
  { id: 'settings', label: 'Account Settings', icon: '⚙️' },
]

// Get user's posts (mock - showing first 5 posts as example)
const userPosts = computed(() => {
  return posts.slice(0, 5)
})

// Navigate to section
const navigateToSection = (sectionId) => {
  router.push(`/profile/${sectionId}`)
}

// Handle settings update
const updateSettings = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const updates = {}
    
    if (formData.value.username !== authStore.currentUser?.username) {
      updates.username = formData.value.username
    }
    
    if (formData.value.email !== authStore.currentUser?.email) {
      updates.email = formData.value.email
    }

    if (formData.value.newPassword) {
      if (formData.value.newPassword !== formData.value.confirmPassword) {
        throw new Error('Passwords do not match.')
      }
      // In a real app, you'd verify currentPassword first
      updates.passwordHash = formData.value.newPassword
    }

    if (Object.keys(updates).length > 0) {
      authStore.updateProfile(updates)
      successMessage.value = 'Settings updated successfully!'
      
      // Clear password fields
      formData.value.currentPassword = ''
      formData.value.newPassword = ''
      formData.value.confirmPassword = ''
    }
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>

<template>
  <main class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <div class="hidden lg:flex w-full h-[calc(100vh-5rem)]">
      <!-- Left sidebar navigation -->
      <aside class="w-1/3 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto border-r border-gray-300 dark:border-gray-700">
        <div class="w-full p-8">
          <h2 class="text-2xl font-bold mb-6 text-emerald-500">Profile Menu</h2>
          <nav class="space-y-2">
            <button
              v-for="item in navItems"
              :key="item.id"
              @click="navigateToSection(item.id)"
              :class="[
                'w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3',
                currentSection === item.id
                  ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_8px_16px_rgba(16,185,129,0.2)]'
                  : 'border-transparent hover:bg-emerald-500/10 hover:border-emerald-500'
              ]"
            >
              <span class="text-2xl">{{ item.icon }}</span>
              <span class="text-lg font-medium" :class="currentSection === item.id ? 'text-emerald-500' : ''">
                {{ item.label }}
              </span>
            </button>
          </nav>
        </div>
      </aside>

      <!-- Right content area -->
      <div class="flex-1 w-2/3 overflow-y-auto">
        <div class="p-8">
          <!-- Profile Information -->
          <div v-if="currentSection === 'information'" class="max-w-4xl">
            <h1 class="text-5xl font-bold mb-8 text-emerald-500">Profile Information</h1>
            <div class="space-y-6">
              <div class="p-6 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-3xl text-white">
                    {{ authStore.currentUser?.username?.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold">{{ authStore.currentUser?.username }}</h2>
                    <p class="text-gray-600 dark:text-gray-400">{{ authStore.currentUser?.role }}</p>
                  </div>
                </div>
                <div class="space-y-3 mt-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                    <p class="text-lg">{{ authStore.currentUser?.email }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Username</label>
                    <p class="text-lg">{{ authStore.currentUser?.username }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Country</label>
                    <p class="text-lg">{{ authStore.currentUser?.country || 'Not specified' }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Salutation</label>
                    <p class="text-lg">{{ authStore.currentUser?.salutation || 'Not specified' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Your Memberships -->
          <div v-if="currentSection === 'memberships'" class="max-w-4xl">
            <h1 class="text-5xl font-bold mb-8 text-emerald-500">Your Memberships</h1>
            <div class="space-y-4">
              <p class="text-xl opacity-80 mb-6">Groups you're a member of:</p>
              <GroupPreviewCard
                v-for="group in groups"
                :key="group.id"
                :group="group"
                variant="main"
              />
            </div>
          </div>

          <!-- Your Posts -->
          <div v-if="currentSection === 'posts'" class="max-w-4xl">
            <h1 class="text-5xl font-bold mb-8 text-emerald-500">Your Posts</h1>
            <div class="space-y-4">
              <p class="text-xl opacity-80 mb-6">Recent posts you've created:</p>
              <PostPreviewCard
                v-for="post in userPosts"
                :key="post.id"
                :post="post"
                variant="main"
              />
            </div>
          </div>

          <!-- Account Settings -->
          <div v-if="currentSection === 'settings'" class="max-w-4xl">
            <h1 class="text-5xl font-bold mb-8 text-emerald-500">Account Settings</h1>
            
            <div v-if="errorMessage" class="mb-6 p-4 rounded-xl bg-red-500/10 border-2 border-red-500 text-red-500">
              {{ errorMessage }}
            </div>
            
            <div v-if="successMessage" class="mb-6 p-4 rounded-xl bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500">
              {{ successMessage }}
            </div>

            <form @submit.prevent="updateSettings" class="space-y-6">
              <div class="p-6 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h2 class="text-2xl font-bold mb-4">Basic Information</h2>
                
                <div class="space-y-4">
                  <div>
                    <label for="username" class="block text-sm font-medium mb-2">Username</label>
                    <input
                      id="username"
                      v-model="formData.username"
                      type="text"
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-emerald-500 focus:outline-none transition-colors"
                      placeholder="Enter username"
                    />
                  </div>

                  <div>
                    <label for="email" class="block text-sm font-medium mb-2">Email</label>
                    <input
                      id="email"
                      v-model="formData.email"
                      type="email"
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-emerald-500 focus:outline-none transition-colors"
                      placeholder="Enter email"
                    />
                  </div>
                </div>
              </div>

              <div class="p-6 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h2 class="text-2xl font-bold mb-4">Change Password</h2>
                
                <div class="space-y-4">
                  <div>
                    <label for="currentPassword" class="block text-sm font-medium mb-2">Current Password</label>
                    <input
                      id="currentPassword"
                      v-model="formData.currentPassword"
                      type="password"
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-emerald-500 focus:outline-none transition-colors"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label for="newPassword" class="block text-sm font-medium mb-2">New Password</label>
                    <input
                      id="newPassword"
                      v-model="formData.newPassword"
                      type="password"
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-emerald-500 focus:outline-none transition-colors"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label for="confirmPassword" class="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input
                      id="confirmPassword"
                      v-model="formData.confirmPassword"
                      type="password"
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-emerald-500 focus:outline-none transition-colors"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                class="w-full px-6 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile view -->
    <div class="lg:hidden p-6">
      <div>
        <!-- Navigation menu for mobile -->
        <div v-if="!route.params.section" class="space-y-4">
          <h1 class="text-4xl font-bold mb-6 text-emerald-500">Profile</h1>
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="navigateToSection(item.id)"
            class="w-full text-left p-4 rounded-xl border-2 border-transparent hover:bg-emerald-500/10 hover:border-emerald-500 flex items-center gap-3"
          >
            <span class="text-2xl">{{ item.icon }}</span>
            <span class="text-lg font-medium">{{ item.label }}</span>
          </button>
        </div>

        <!-- Content sections for mobile -->
        <div v-else>
          <button
            @click="router.push('/profile')"
            class="mb-6 text-emerald-500 hover:opacity-70 flex items-center gap-2"
          >
            ← Back to Profile Menu
          </button>

          <!-- Profile Information Mobile -->
          <div v-if="currentSection === 'information'">
            <h1 class="text-4xl font-bold mb-6 text-emerald-500">Profile Information</h1>
            <div class="space-y-6">
              <div class="p-6 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-2xl text-white">
                    {{ authStore.currentUser?.username?.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <h2 class="text-xl font-bold">{{ authStore.currentUser?.username }}</h2>
                    <p class="text-gray-600 dark:text-gray-400">{{ authStore.currentUser?.role }}</p>
                  </div>
                </div>
                <div class="space-y-3 mt-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                    <p class="text-lg">{{ authStore.currentUser?.email }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Username</label>
                    <p class="text-lg">{{ authStore.currentUser?.username }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Country</label>
                    <p class="text-lg">{{ authStore.currentUser?.country || 'Not specified' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Your Memberships Mobile -->
          <div v-if="currentSection === 'memberships'">
            <h1 class="text-4xl font-bold mb-6 text-emerald-500">Your Memberships</h1>
            <GroupPreviewCard
              v-for="group in groups"
              :key="group.id"
              :group="group"
              variant="mobile"
            />
          </div>

          <!-- Your Posts Mobile -->
          <div v-if="currentSection === 'posts'">
            <h1 class="text-4xl font-bold mb-6 text-emerald-500">Your Posts</h1>
            <PostPreviewCard
              v-for="post in userPosts"
              :key="post.id"
              :post="post"
              variant="mobile"
            />
          </div>

          <!-- Account Settings Mobile -->
          <div v-if="currentSection === 'settings'">
            <h1 class="text-4xl font-bold mb-6 text-emerald-500">Account Settings</h1>
            
            <div v-if="errorMessage" class="mb-6 p-4 rounded-xl bg-red-500/10 border-2 border-red-500 text-red-500">
              {{ errorMessage }}
            </div>
            
            <div v-if="successMessage" class="mb-6 p-4 rounded-xl bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500">
              {{ successMessage }}
            </div>

            <form @submit.prevent="updateSettings" class="space-y-6">
              <div class="p-6 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h2 class="text-xl font-bold mb-4">Basic Information</h2>
                
                <div class="space-y-4">
                  <div>
                    <label for="username-mobile" class="block text-sm font-medium mb-2">Username</label>
                    <input
                      id="username-mobile"
                      v-model="formData.username"
                      type="text"
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-emerald-500 focus:outline-none transition-colors"
                      placeholder="Enter username"
                    />
                  </div>

                  <div>
                    <label for="email-mobile" class="block text-sm font-medium mb-2">Email</label>
                    <input
                      id="email-mobile"
                      v-model="formData.email"
                      type="email"
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-emerald-500 focus:outline-none transition-colors"
                      placeholder="Enter email"
                    />
                  </div>
                </div>
              </div>

              <div class="p-6 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h2 class="text-xl font-bold mb-4">Change Password</h2>
                
                <div class="space-y-4">
                  <div>
                    <label for="currentPassword-mobile" class="block text-sm font-medium mb-2">Current Password</label>
                    <input
                      id="currentPassword-mobile"
                      v-model="formData.currentPassword"
                      type="password"
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-emerald-500 focus:outline-none transition-colors"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label for="newPassword-mobile" class="block text-sm font-medium mb-2">New Password</label>
                    <input
                      id="newPassword-mobile"
                      v-model="formData.newPassword"
                      type="password"
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-emerald-500 focus:outline-none transition-colors"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label for="confirmPassword-mobile" class="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input
                      id="confirmPassword-mobile"
                      v-model="formData.confirmPassword"
                      type="password"
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-emerald-500 focus:outline-none transition-colors"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                class="w-full px-6 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

