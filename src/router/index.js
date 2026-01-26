import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //public
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../views/HelpView.vue'),
    },
    {
      path: '/imprint',
      name: 'imprint',
      component: ()  => import('../views/ImprintView.vue'),
    },

    //users
    {
      path: '/posts',
      name: 'posts',
      component: () => import('../views/PostView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/posts/:title',
      name: 'post-detail',
      component: () => import('../views/PostView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    
    
    {
      path: '/groups',
      name: 'groups',
      component: () => import('../views/GroupView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/groups/:name',
      name: 'groups-detail',
      component: () => import('../views/GroupView.vue'),
      meta: {
        requiresAuth: true
      }
    },


    //only admin
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UserView.vue'),
      meta: {
        requiresAuth: true,
        role: "ADMIN"
      }
    },
    {
      path: '/users/:name',
      name: 'users-detail',
      component: () => import('../views/UserView.vue'),
      meta: {
        requiresAuth: true,
        role: "ADMIN"
      }
    },

    {
      path: '/users/:id',
      name: 'user-admin-edit',
      component: () => import("../views/ProfileView.vue"),
      meta:{
        requiresAuth: true,
        role: "ADMIN"
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile/:section',
      name: 'profile-section',
      component: () => import('../views/ProfileView.vue'),
      meta: {
        requiresAuth: true
      }
    },
  ],
})

import { useAuthStore } from '@/stores/auth';

router.beforeEach((to) => {
  const auth = useAuthStore();

  const requiresAuth = to.matched.some(r => r.meta?.requiresAuth);
  const requiredRole = to.meta?.role;

  if(requiresAuth && !auth.isLoggedIn){
    return{
      path: "/login",
      query: {
        redirect: to.fullPath
      },
    };
  }


    if(requiredRole && auth.role !== requiredRole){
      return{
        path: "/"
      };
    }

    if(auth.isLoggedIn && (to.path === "/login" || to.path === "/register")){
      return {
        path: "/"
      };
    }

    return true; 
});

export default router
