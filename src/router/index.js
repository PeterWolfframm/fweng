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
      path: '/posts',
      name: 'posts',
      component: () => import('../views/PostView.vue'),
    },
    {
      path: '/posts/:title',
      name: 'post-detail',
      component: () => import('../views/PostView.vue'),
    },
    {
      path: '/groups',
      name: 'groups',
      component: () => import('../views/GroupView.vue'),
    },
    {
      path: '/imprint',
      name: 'imprint',
      component: ()  => import('../views/ImprintView.vue'),
    },
  ],
})

export default router
