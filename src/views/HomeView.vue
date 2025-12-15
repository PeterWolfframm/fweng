<script setup>
import TwoColumnLayout from '../components/TwoColumnLayout.vue'
import PostPreviewCard from '../components/PostPreviewCard.vue'
import GroupPreviewCard from '../components/GroupPreviewCard.vue'
import articles from '../posts.json'
import groups from '../groups.json'

const firstThreeGroups = groups.slice(0, 3)
</script>

<template>
  <TwoColumnLayout>
    <template #sidebar>
      <div class="px-0 pt-0">
        <h1 class="text-6xl font-bold mb-8">🗣️ yap.</h1>
        <div class="mt-12">
          <GroupPreviewCard
            v-for="group in firstThreeGroups"
            :key="group.id"
            :group="group"
            variant="sidebar"
          />
        </div>
      </div>
    </template>

    <template #main>
      <PostPreviewCard
        v-for="article in articles"
        :key="article.id"
        :post="article"
        variant="main"
      />
    </template>

    <template #mobile>
      <PostPreviewCard
        v-for="article in articles"
        :key="article.id"
        :post="article"
        variant="mobile"
      />
    </template>
  </TwoColumnLayout>
</template>
