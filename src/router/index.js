import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

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
      path: '/users',
      name: 'users',
      component: () => import('../views/UserView.vue'),
    },
    {
      path: '/users/:name',
      name: 'users-detail',
      component: () => import('../views/UserView.vue'),
    },
    {
      path: '/groups',
      name: 'groups',
      component: () => import('../views/GroupView.vue'),
    },
    {
      path: '/groups/:name',
      name: 'groups-detail',
      component: () => import('../views/GroupView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      beforeEnter: (to, from, next) => {
        const auth = useAuthStore()
        if (auth.isLoggedIn) {
          next('/profile')
        } else {
          next()
        }
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      beforeEnter: (to, from, next) => {
        const auth = useAuthStore()
        if (auth.isLoggedIn) {
          next('/profile')
        } else {
          next()
        }
      },
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../views/HelpView.vue'),
    },
    {
      path: '/imprint',
      name: 'imprint',
      component: () => import('../views/ImprintView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/profile/overview',
      name: 'profile-overview',
      component: () => import('../views/ProfileOverviewView.vue'),
    },
    {
      path: '/profile/settings',
      name: 'profile-settings',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/profile/information',
      name: 'profile-information',
      component: () => import('../views/ProfileInformationView.vue'),
    },
    {
      path: '/profile/history',
      name: 'profile-history',
      component: () => import('../views/ProfileHistoryView.vue'),
    },
    {
      path: '/profile/:section',
      name: 'profile-section',
      component: () => import('../views/ProfileView.vue'),
    },
  ],
})

export default router
