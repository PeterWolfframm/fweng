<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TwoColumnLayout from '../components/TwoColumnLayout.vue'
import FullScreenWidth from '../components/FullScreenWidth.vue'
import GroupPreviewCard from '../components/GroupPreviewCard.vue'
import PostPreviewCard from '../components/PostPreviewCard.vue'
import DetailHeader from '../components/DetailHeader.vue'
import groups from '../groups.json'
import posts from '../posts.json'

const route = useRoute()
const router = useRouter()

const currentGroup = computed(() => {
  const name = route.params.name
  if (!name) return null
  return groups.find((group) => group.name === name)
})

const groupPosts = computed(() => {
  if (!currentGroup.value) return []
  return posts.filter((post) => post.icon === currentGroup.value.icon)
})
</script>

<template>
  <TwoColumnLayout v-if="currentGroup">
    <template #sidebar>
      <GroupPreviewCard
        v-for="group in groups"
        :key="group.id"
        :group="group"
        :isActive="currentGroup && currentGroup.name === group.name"
        variant="sidebar"
        contentClass="text-sm opacity-70"
      />
    </template>

    <template #main>
      <DetailHeader :title="currentGroup.name" :description="currentGroup.description" variant="main" />
      <PostPreviewCard
        v-for="post in groupPosts"
        :key="post.id"
        :post="post"
        variant="main"
        :show-emoji="false"
      />
    </template>

    <template #mobile>
      <div class="group-content">
        <button
          @click="router.push('/groups')"
          class="mb-6 text-emerald-500 hover:opacity-70 flex items-center gap-2"
        >
          ← Back to groups
        </button>
        <DetailHeader :title="currentGroup.name" :description="currentGroup.description" variant="mobile" />
        <PostPreviewCard
          v-for="post in groupPosts"
          :key="post.id"
          :post="post"
          variant="mobile"
          :show-emoji="false"
        />
      </div>
    </template>
  </TwoColumnLayout>

  <FullScreenWidth v-else>
    <template #desktop>
      <GroupPreviewCard
        v-for="group in groups"
        :key="group.id"
        :group="group"
        variant="main"
      />
    </template>

    <template #mobile>
      <GroupPreviewCard
        v-for="group in groups"
        :key="group.id"
        :group="group"
        variant="mobile"
        contentClass="text-sm opacity-70"
      />
    </template>
  </FullScreenWidth>
</template>
