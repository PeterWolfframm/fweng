<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import TwoColumnLayout from '../components/TwoColumnLayout.vue'
import GroupPreviewCard from '../components/GroupPreviewCard.vue'
import PostPreviewCard from '../components/PostPreviewCard.vue'
import InputGroupComponent from '../components/InputGroupComponent.vue'
import groups from '../groups.json'
import posts from '../posts.json'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  username: authStore.currentUser?.username || '',
  email: authStore.currentUser?.email || '',
})

const inputGroupRef = ref(null)

const errorMessage = ref('')
const successMessage = ref('')

const currentSection = computed(() => {
  return route.params.section || 'memberships'
})

const navItems = [
  {
    id: 'memberships',
    label: 'Your Memberships',
    icon: '🏘️',
    description: 'Groups you belong to',
  },
  {
    id: 'posts',
    label: 'Your Posts',
    icon: '📝',
    description: 'Your recent activity',
  },
  {
    id: 'settings',
    label: 'Account Settings',
    icon: '⚙️',
    description: 'Manage your account',
  },
]

const userPosts = computed(() => {
  return posts.slice(0, 5)
})

const navigateToSection = (sectionId) => {
  if (sectionId === currentSection.value) return
  router.push(`/profile/${sectionId}`)
}

watch(currentSection, () => {
  errorMessage.value = ''
  successMessage.value = ''
})

const updateSettings = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const inputData = inputGroupRef.value?.formData || formData.value
    const updates = {}

    if (inputData.username !== authStore.currentUser?.username) {
      updates.username = inputData.username
    }

    if (inputData.email !== authStore.currentUser?.email) {
      updates.email = inputData.email
    }

    if (Object.keys(updates).length > 0) {
      authStore.updateProfile(updates)
      successMessage.value = 'Settings updated successfully!'
    }
  } catch (error) {
    errorMessage.value = error.message
  }
}

const handleInputGroupUpdate = (data) => {
  formData.value.username = data.username
  formData.value.email = data.email
}
</script>

<template>
  <TwoColumnLayout>
    <template #sidebar>
      <div class="px-0 pt-0">
        <div
          class="mb-8 p-6 rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 text-white shadow-lg"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/30"
            >
              {{ authStore.currentUser?.username?.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h2 class="text-xl font-bold">{{ authStore.currentUser?.username }}</h2>
              <p class="text-emerald-100 text-sm">{{ authStore.currentUser?.email }}</p>
            </div>
          </div>
        </div>

        <nav class="space-y-2">
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="navigateToSection(item.id)"
            :class="[
              'w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group',
              currentSection === item.id
                ? 'bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/20'
                : 'border-transparent hover:bg-emerald-500/5 hover:border-emerald-500/30',
            ]"
          >
            <div class="flex items-center gap-3 mb-1">
              <span class="text-2xl">{{ item.icon }}</span>
              <span
                :class="[
                  'text-lg font-semibold transition-colors',
                  currentSection === item.id ? 'text-emerald-500' : 'group-hover:text-emerald-500',
                ]"
              >
                {{ item.label }}
              </span>
            </div>
            <p
              :class="[
                'text-sm ml-11 transition-colors',
                currentSection === item.id
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-500 dark:text-gray-400',
              ]"
            >
              {{ item.description }}
            </p>
          </button>
        </nav>
      </div>
    </template>

    <template #main>
      <div class="w-full max-w-4xl mx-auto">
        <div class="min-h-[600px]">
          <div v-if="currentSection === 'memberships'" class="space-y-6">
            <div class="mb-8">
              <h1 class="text-4xl font-bold text-emerald-500 mb-2">Your Memberships</h1>
              <p class="text-gray-600 dark:text-gray-400">
                Groups you're a member of ({{ groups.length }})
              </p>
            </div>

            <div class="space-y-4">
              <GroupPreviewCard
                v-for="group in groups"
                :key="group.id"
                :group="group"
                variant="main"
              />
            </div>

            <div v-if="groups.length === 0" class="text-center py-12">
              <p class="text-xl text-gray-500 dark:text-gray-400 mb-4">
                You're not a member of any groups yet
              </p>
              <button
                class="px-6 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
              >
                Discover Groups
              </button>
            </div>
          </div>

          <div v-if="currentSection === 'posts'" class="space-y-6">
            <div class="mb-8">
              <h1 class="text-4xl font-bold text-emerald-500 mb-2">Your Posts</h1>
              <p class="text-gray-600 dark:text-gray-400">
                Recent posts you've created ({{ userPosts.length }})
              </p>
            </div>

            <div class="space-y-4">
              <PostPreviewCard
                v-for="post in userPosts"
                :key="post.id"
                :post="post"
                variant="main"
              />
            </div>

            <div v-if="userPosts.length === 0" class="text-center py-12">
              <p class="text-xl text-gray-500 dark:text-gray-400 mb-4">
                You haven't created any posts yet
              </p>
              <button
                class="px-6 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
              >
                Create Your First Post
              </button>
            </div>
          </div>

          <div v-if="currentSection === 'settings'" class="space-y-6">
            <div class="mb-8">
              <h1 class="text-4xl font-bold text-emerald-500 mb-2">Account Settings</h1>
              <p class="text-gray-600 dark:text-gray-400">
                Manage your account preferences and security
              </p>
            </div>

            <div
              v-if="errorMessage"
              class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 flex items-start gap-3"
            >
              <span class="text-xl">⚠️</span>
              <span>{{ errorMessage }}</span>
            </div>

            <div
              v-if="successMessage"
              class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-start gap-3"
            >
              <span class="text-xl">✓</span>
              <span>{{ successMessage }}</span>
            </div>

            <form @submit.prevent="updateSettings" class="space-y-6">
              <InputGroupComponent ref="inputGroupRef" @update="handleInputGroupUpdate" />

              <div class="flex gap-4">
                <button
                  type="submit"
                  class="flex-1 px-6 py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-500/30"
                >
                  💾 Save Changes
                </button>
                <button
                  type="button"
                  @click="navigateToSection('memberships')"
                  class="px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </template>

    <template #mobile>
      <div v-if="!route.params.section" class="space-y-6">
        <div
          class="p-6 rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 text-white shadow-lg"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/30"
            >
              {{ authStore.currentUser?.username?.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h1 class="text-2xl font-bold">{{ authStore.currentUser?.username }}</h1>
              <p class="text-emerald-100 text-sm">{{ authStore.currentUser?.email }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="navigateToSection(item.id)"
            class="w-full text-left p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all active:scale-95"
          >
            <div class="flex items-center gap-3 mb-1">
              <span class="text-2xl">{{ item.icon }}</span>
              <span class="text-lg font-semibold">{{ item.label }}</span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 ml-11">
              {{ item.description }}
            </p>
          </button>
        </div>
      </div>

      <div v-else>
        <button
          @click="router.push('/profile')"
          class="mb-6 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-2 transition-colors"
        >
          <span class="text-lg">←</span>
          <span>Back to Profile</span>
        </button>

        <div v-if="currentSection === 'memberships'" class="space-y-4">
          <div>
            <h1 class="text-3xl font-bold text-emerald-500 mb-1">Your Memberships</h1>
            <p class="text-gray-600 dark:text-gray-400">{{ groups.length }} groups</p>
          </div>

          <div class="space-y-3">
            <GroupPreviewCard
              v-for="group in groups"
              :key="group.id"
              :group="group"
              variant="mobile"
            />
          </div>
        </div>

        <div v-if="currentSection === 'posts'" class="space-y-4">
          <div>
            <h1 class="text-3xl font-bold text-emerald-500 mb-1">Your Posts</h1>
            <p class="text-gray-600 dark:text-gray-400">{{ userPosts.length }} posts</p>
          </div>

          <div class="space-y-3">
            <PostPreviewCard
              v-for="post in userPosts"
              :key="post.id"
              :post="post"
              variant="mobile"
            />
          </div>
        </div>

        <div v-if="currentSection === 'settings'" class="space-y-6">
          <div>
            <h1 class="text-3xl font-bold text-emerald-500 mb-1">Account Settings</h1>
            <p class="text-gray-600 dark:text-gray-400">Manage your account</p>
          </div>

          <div
            v-if="errorMessage"
            class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-start gap-2"
          >
            <span>⚠️</span>
            <span>{{ errorMessage }}</span>
          </div>

          <div
            v-if="successMessage"
            class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm flex items-start gap-2"
          >
            <span>✓</span>
            <span>{{ successMessage }}</span>
          </div>

          <form @submit.prevent="updateSettings" class="space-y-4">
            <InputGroupComponent ref="inputGroupRef" @update="handleInputGroupUpdate" />

            <div class="grid grid-cols-2 gap-3">
              <button
                type="submit"
                class="px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all"
              >
                💾 Save
              </button>
              <button
                type="button"
                @click="navigateToSection('memberships')"
                class="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>
  </TwoColumnLayout>
</template>
