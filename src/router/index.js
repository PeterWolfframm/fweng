import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/articles',
      name: 'articles',
      component: () => import('../views/ArticleView.vue'),
    },
    {
      path: '/articles/:title',
      name: 'article-detail',
      component: () => import('../views/ArticleView.vue'),
    },
  ],
})

export default router
