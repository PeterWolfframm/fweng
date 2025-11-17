<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import EmojiContainer from '../components/EmojiContainer.vue'
import articles from '../posts.json'

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

const navigateToArticle = (title) => {
  router.push(`/articles/${encodeURIComponent(title)}`)
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
              class="flex items-center justify-start py-2 transition-transform duration-200 ease-in-out hover:tranemerald-x-1"
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
          <div
            v-for="article in articles"
            :key="article.id"
            @click="navigateToArticle(article.title)"
            class="group mt-8 flex relative p-4 rounded-xl border-2 border-transparent cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500 hover:shadow-[0_8px_16px_rgba(16,185,129,0.2)] lg:mt-0 lg:py-6 lg:px-4 lg:pl-20 before:content-[''] before:border-l before:border-gray-300 dark:before:border-gray-700 before:absolute before:left-0 before:bottom-[calc(50%+25px)] before:h-[calc(50%-25px)] before:hidden before:lg:block after:content-[''] after:border-l after:border-gray-300 dark:after:border-gray-700 after:absolute after:left-0 after:top-[calc(50%+25px)] after:h-[calc(50%-25px)] after:hidden after:lg:block first:before:hidden! last:after:hidden!"
          >
            <EmojiContainer>
              {{ article.icon }}
            </EmojiContainer>
            <div class="flex-1 ml-4">
              <h3
                class="text-xl font-medium mb-1.5 text-emerald-500 group-hover:text-emerald-600"
              >
                {{ article.title }}
              </h3>
              <div v-html="article.content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="lg:hidden p-6">
      <div
        v-for="article in articles"
        :key="article.id"
        @click="navigateToArticle(article.title)"
        class="group mt-8 flex relative p-4 rounded-xl border-2 border-transparent cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500 hover:shadow-[0_8px_16px_rgba(16,185,129,0.2)]"
      >
        <EmojiContainer>
          {{ article.icon }}
        </EmojiContainer>
        <div class="flex-1 ml-4">
          <h3
            class="text-xl font-medium mb-1.5 text-emerald-500 group-hover:text-emerald-600"
          >
            {{ article.title }}
          </h3>
          <div v-html="article.content"></div>
        </div>
      </div>
    </div>
  </main>
</template>
