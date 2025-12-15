<script setup>
import { ref } from 'vue'
import TwoColumnLayout from '../components/TwoColumnLayout.vue'
import CardFoundationComponent from '../components/CardFoundationComponent.vue'
import SingleEmojiCard from '../components/SingleEmojiCard.vue'
import DetailHeader from '../components/DetailHeader.vue'

const activeCard = ref('info')

const profileCards = [
  {
    id: 'info',
    emoji: '👤📊📊',
    title: 'Profile Information',
    description: 'Your personal details and account settings',
  },
  {
    id: 'activity',
    emoji: '📊📊📊',
    title: 'Activity & Stats',
    description: 'Track your engagement and contributions',
  },
  {
    id: 'preferences',
    emoji: '⚙️📊📊',
    title: 'Preferences',
    description: 'Customize your experience and notifications',
  },
]

const emojiCards = ['🎉', '🚀', '💡', '🎨', '⭐', '🔥']
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
        <h3 class="text-xl font-bold mb-2 group-hover:text-emerald-500 transition-colors">
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
      <SingleEmojiCard
        v-for="(emoji, index) in emojiCards"
        :key="index"
        :emoji="emoji"
        variant="main"
      />
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
          <h3 class="text-xl font-bold mb-2">{{ card.title }}</h3>
          <p class="text-sm opacity-70">{{ card.description }}</p>
        </CardFoundationComponent>
        <SingleEmojiCard
          v-for="(emoji, index) in emojiCards"
          :key="'emoji-' + index"
          :emoji="emoji"
          variant="mobile"
        />
      </div>
    </template>
  </TwoColumnLayout>
</template>
