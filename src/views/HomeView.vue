<script setup>
import PostPreviewCard from '../components/PostPreviewCard.vue'
import GroupPreviewCard from '../components/GroupPreviewCard.vue'
import articles from '../posts.json'
import groups from '../groups.json'

const firstThreeGroups = groups.slice(0, 3)
</script>

<template>
  <main class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <div class="hidden lg:flex w-full h-[calc(100vh-5rem)]">
      <aside class="w-1/3 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
        <div class="w-full px-8 pt-8">
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
      </aside>

      <div class="flex-1 w-2/3 overflow-y-auto">
        <div class="p-8">
          <PostPreviewCard
            v-for="article in articles"
            :key="article.id"
            :post="article"
            variant="main"
          />
        </div>
      </div>
    </div>

    <div class="lg:hidden p-6">
      <PostPreviewCard
        v-for="article in articles"
        :key="article.id"
        :post="article"
        variant="mobile"
      />
    </div>
  </main>
</template>
