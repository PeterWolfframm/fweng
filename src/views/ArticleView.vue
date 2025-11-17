<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EmojiContainer from '../components/EmojiContainer.vue'
import articles from '../articles.json'

const route = useRoute()
const router = useRouter()

const currentArticle = computed(() => {
  const title = route.params.title
  if (!title) return null
  return articles.find((article) => article.title === title)
})

const navigateToArticle = (title) => {
  router.push(`/articles/${encodeURIComponent(title)}`)
}
</script>

<template>
  <main class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <div v-if="currentArticle" class="hidden lg:flex w-full h-[calc(100vh-5rem)]">
      <aside class="w-1/3 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
        <div class="w-full p-8">
          <div
            v-for="article in articles"
            :key="article.id"
            @click="navigateToArticle(article.title)"
            class="group mt-8 flex relative p-4 rounded-xl border-2 cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500 hover:shadow-[0_8px_16px_rgba(16,185,129,0.2)] lg:mt-0 lg:py-6 lg:px-4 lg:pl-20 before:content-[''] before:border-l before:border-gray-300 dark:before:border-gray-700 before:absolute before:left-0 before:bottom-[calc(50%+25px)] before:h-[calc(50%-25px)] before:hidden before:lg:block after:content-[''] after:border-l after:border-gray-300 dark:after:border-gray-700 after:absolute after:left-0 after:top-[calc(50%+25px)] after:h-[calc(50%-25px)] after:hidden after:lg:block first:before:hidden! last:after:hidden!"
            :class="
              currentArticle && currentArticle.title === article.title
                ? 'bg-emerald-500/10 border-emerald-500'
                : 'border-transparent'
            "
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
              <div class="text-sm opacity-70" v-html="article.content"></div>
            </div>
          </div>
        </div>
      </aside>

      <div class="flex-1 w-2/3 overflow-y-auto">
        <div class="p-8">
          <div class="article-content max-w-4xl">
            <h1 class="text-5xl font-bold mb-8">{{ currentArticle.title }}</h1>
            <div class="text-xl leading-relaxed opacity-80" v-html="currentArticle.content"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="hidden lg:block w-full">
      <div class="p-8 max-w-7xl mx-auto">
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

    <div class="lg:hidden p-6">
      <div v-if="currentArticle" class="article-content">
        <button
          @click="router.push('/articles')"
          class="mb-6 text-emerald-500 hover:opacity-70 flex items-center gap-2"
        >
          ← Back to articles
        </button>
        <h1 class="text-4xl font-bold mb-6">{{ currentArticle.title }}</h1>
        <div class="text-lg leading-relaxed opacity-80" v-html="currentArticle.content"></div>
      </div>
      <div v-else>
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
            <div class="text-sm opacity-70" v-html="article.content"></div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
