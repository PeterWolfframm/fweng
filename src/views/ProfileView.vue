<script setup>
import { ref } from 'vue'
import TwoColumnLayout from '../components/TwoColumnLayout.vue'
import CardFoundationComponent from '../components/CardFoundationComponent.vue'
import DetailHeader from '../components/DetailHeader.vue'
import InputGroup from '../components/InputGroup.vue'
import GroupPreviewCard from '../components/GroupPreviewCard.vue'
import PostPreviewCard from '../components/PostPreviewCard.vue'
import InputGroupComponent from '../components/InputGroupComponent.vue'
import groups from '../groups.json'
import posts from '../posts.json'

const activeCard = ref('info')

// Form data for profile information
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const username = ref('')
const bio = ref('')

const profileCards = [
  {
    id: 'info',
    emoji: '👤',
    title: 'Profile Information',
    description: 'Your personal details and account settings',
  },
  {
    id: 'preferences',
    emoji: '⚙️',
    title: 'Preferences',
    description: 'Customize your experience and notifications',
  },
]
</script>

<template>
  <TwoColumnLayout>
    <template #sidebar>
      <CardFoundationComponent
        v-for="card in profileCards"
        :key="card.id"
        :isActive="activeCard === card.id"
        variant="sidebar"
        @click="activeCard = card.id"
      >
        <template #emoji>
          {{ card.emoji }}
        </template>
        <h3 class="text-xl font-medium mb-1.5 text-emerald-500 group-hover:text-emerald-600">
          {{ card.title }}
        </h3>
        <p class="text-sm opacity-70">{{ card.description }}</p>
      </CardFoundationComponent>
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
      <div>
        <DetailHeader
          title="Your Profile"
          description="Manage your account settings, view your activity, and customize your experience on the platform."
          variant="mobile"
        />
        <CardFoundationComponent
          v-for="card in profileCards"
          :key="card.id"
          :isActive="activeCard === card.id"
          variant="mobile"
          @click="activeCard = card.id"
        >
          <template #emoji>
            {{ card.emoji }}
          </template>
          <h3 class="text-xl font-medium mb-1.5 text-emerald-500 group-hover:text-emerald-600">
            {{ card.title }}
          </h3>
          <p class="text-sm opacity-70">{{ card.description }}</p>
        </CardFoundationComponent>

        <div v-if="activeCard === 'info'" class="space-y-0">
          <InputGroup
            label1="First Name"
            label2="Last Name"
            placeholder1="Enter your first name"
            placeholder2="Enter your last name"
            v-model:modelValue1="firstName"
            v-model:modelValue2="lastName"
            variant="mobile"
            :showEmoji="true"
          >
            <template #emoji>👤</template>
          </InputGroup>

          <InputGroup
            label1="Email Address"
            label2="Phone Number"
            placeholder1="your.email@example.com"
            placeholder2="+1 (555) 000-0000"
            type1="email"
            type2="tel"
            v-model:modelValue1="email"
            v-model:modelValue2="phone"
            variant="mobile"
            :showEmoji="true"
          >
            <template #emoji>📧</template>
          </InputGroup>

          <InputGroup
            label1="Username"
            label2="Bio"
            placeholder1="@username"
            placeholder2="Tell us about yourself"
            v-model:modelValue1="username"
            v-model:modelValue2="bio"
            variant="mobile"
            :showEmoji="true"
          >
            <template #emoji>✏️</template>
          </InputGroup>
        </div>
      </div>
    </template>
  </TwoColumnLayout>
</template>
