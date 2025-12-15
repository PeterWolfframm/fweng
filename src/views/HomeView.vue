<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import EmojiContainer from '../components/EmojiContainer.vue'
import PostPreviewCard from '../components/PostPreviewCard.vue'
import articles from '../posts.json'
import groups from '../groups.json'

const router = useRouter()

const uniqueEmojiCombinations = computed(() => {
  const emojiSet = new Set()
  articles.forEach((article) => {
    if (article.icon) {
      emojiSet.add(article.icon)
    }
  })
  return Array.from(emojiSet)
})

const getGroupNameByEmoji = (emoji) => {
  const group = groups.find((g) => g.icon === emoji)
  return group ? group.name : null
}

const navigateToGroup = (emoji) => {
  const groupName = getGroupNameByEmoji(emoji)
  if (groupName) {
    router.push(`/groups/${encodeURIComponent(groupName)}`)
  }
}
</script>

<template>
  <main class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <div class="hidden lg:flex w-full h-[calc(100vh-5rem)]">
      <aside class="w-1/3 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
        <div class="w-full px-8 pt-8">
          <h1 class="text-6xl font-bold mb-8">🗣️ yap.</h1>
          <div class="mt-12 space-y-8">
            <div
              v-for="(emoji, index) in uniqueEmojiCombinations"
              :key="index"
              @click="navigateToGroup(emoji)"
              class="flex items-center justify-start py-2 transition-transform duration-200 ease-in-out hover:translate-x-1 cursor-pointer"
            >
              <div
                class="[&_.emoji-container]:static [&_.emoji-container]:w-20 [&_.emoji-container]:h-[60px] [&_.emoji-container]:m-0 [&_.emoji-container]:shadow-md [&_.emoji-container]:transition-all [&_.emoji-container]:duration-300 [&_.emoji-container]:ease-in-out hover:[&_.emoji-container]:shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:[&_.emoji-container]:scale-105"
              >
                <EmojiContainer>
                  {{ emoji }}
                </EmojiContainer>
              </div>
            </div>
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
