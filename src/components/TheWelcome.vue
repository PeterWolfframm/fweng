<script setup>
import { useRouter } from 'vue-router'
import WelcomeItem from './WelcomeItem.vue'
import articles from '../articles.json'

const router = useRouter()

const navigateToArticle = (title) => {
  router.push({ path: '/', query: { title } })
}
</script>

<template>
  <WelcomeItem
    v-for="article in articles"
    :key="article.id"
    @click="navigateToArticle(article.title)"
    class="cursor-pointer hover:opacity-80"
  >
    <template #icon>{{ article.icon }}</template>
    <template #heading>{{ article.title }}</template>
    <div v-html="article.content"></div>
  </WelcomeItem>
</template>
