<script setup>
import { ref } from 'vue'
import DetailHeader from '../components/DetailHeader.vue'
import InputGroup from '../components/InputGroup.vue'

// Form data for profile information
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const username = ref('')
const bio = ref('')
</script>

<template>
  <div class="space-y-0">
    <DetailHeader
      title="Profile Information"
      description="Manage your personal details and account information."
      variant="main"
    />

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
</template>
