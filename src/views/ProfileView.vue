<script setup>
import { ref } from 'vue'
import TwoColumnLayout from '../components/TwoColumnLayout.vue'
import CardFoundationComponent from '../components/CardFoundationComponent.vue'
import DetailHeader from '../components/DetailHeader.vue'
import InputGroup from '../components/InputGroup.vue'

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
      <DetailHeader
        title="Your Profile"
        description="Manage your account settings, view your activity, and customize your experience on the platform."
        variant="main"
      />

      <div v-if="activeCard === 'info'" class="space-y-0">
        <InputGroup
          label1="First Name"
          label2="Last Name"
          placeholder1="Enter your first name"
          placeholder2="Enter your last name"
          v-model:modelValue1="firstName"
          v-model:modelValue2="lastName"
          variant="main"
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
          variant="main"
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
          variant="main"
          :showEmoji="true"
        >
          <template #emoji>✏️</template>
        </InputGroup>
      </div>

      <div v-else-if="activeCard === 'preferences'" class="space-y-0">
        <DetailHeader
          title="Preferences"
          description="Your preference settings will appear here."
          variant="main"
        />
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
