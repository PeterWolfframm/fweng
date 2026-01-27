<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EmojiContainer from '../components/EmojiContainer.vue'
import {useAuthStore} from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const users = computed(() => auth.users)

const currentUser = computed(() => {
  const name = decodeURIComponent(route.params.name || '')
  if (!name) return null
  return users.value.find((user) => user.username === name) || null
})

const navigateToUser = (name) => {
  router.push(`/users/${encodeURIComponent(name)}`)
}

const isAdmin = computed(() => auth.role === 'ADMIN')

const visibleUsers = computed(() => {
  if(isAdmin.value) return auth.users
  const me = auth.currentUser
  return me ? [me] : []
})
</script>

<template>
  <main class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <div v-if="currentUser" class="hidden lg:flex w-full h-[calc(100vh-5rem)]">
      <aside class="w-1.5/3 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
        <div class="w-full p-8">
          <div
            v-for="user in visibleUsers"
            :key="user.id"
            @click="navigateToUser(user.username)"
            class="group mt-8 flex relative p-4 rounded-xl border-2 cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500 hover:shadow-[0_8px_16px_rgba(16,185,129,0.2)] lg:mt-0 lg:py-6 lg:px-4 lg:pl-20 before:content-[''] before:border-l before:border-gray-300 dark:before:border-gray-700 before:absolute before:left-0 before:bottom-[calc(50%+25px)] before:h-[calc(50%-25px)] before:hidden before:lg:block after:content-[''] after:border-l after:border-gray-300 dark:after:border-gray-700 after:absolute after:left-0 after:top-[calc(50%+25px)] after:h-[calc(50%-25px)] after:hidden after:lg:block first:before:hidden! last:after:hidden!"
            :class="
              currentUser && currentUser.username === user.username
                ? 'bg-emerald-500/10 border-emerald-500'
                : 'border-transparent'
            "
          >
            <EmojiContainer>
              {{user.role === 'ADMIN' ? '🛡️' : '👤'}}
            </EmojiContainer>
            <div class="flex-1 ml-4 min-w-5">
              <h3
                class="text-xl font-medium mb-1.5 text-emerald-500 group-hover:text-emerald-600 whitespace-nowrap"
              >
                {{ user.username }}
              </h3>

            </div>
          </div>
        </div>
      </aside>

      <div class="flex-1 w-1.5/3 overflow-y-auto">
        <div class="p-8">
          <div class="post-content max-w-6xl">
            <h1 class="text-5xl font-bold mb-8">{{ currentUser.username }}</h1>
            <div class="text-xl leading-relaxed opacity-80" v-html="currentUser.email"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="hidden lg:block w-full">
      <div class="px-8 py-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
        <div
          v-for="user in visibleUsers"
          :key="user.id"
          @click="navigateToUser(user.username)"
          class="group mt-8 flex relative p-4 rounded-xl border-2 border-transparent cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500 hover:shadow-[0_8px_16px_rgba(16,185,129,0.2)] lg:mt-0 lg:py-6 lg:px-4 lg:pl-20 before:content-[''] before:border-l before:border-gray-300 dark:before:border-gray-700 before:absolute before:left-0 before:bottom-[calc(50%+25px)] before:h-[calc(50%-25px)] before:hidden before:lg:block after:content-[''] after:border-l after:border-gray-300 dark:after:border-gray-700 after:absolute after:left-0 after:top-[calc(50%+25px)] after:h-[calc(50%-25px)] after:hidden after:lg:block first:before:hidden! last:after:hidden!"
        >
          <EmojiContainer>
            {{user.role === 'ADMIN' ? '🛡️' : '👤'}}
          </EmojiContainer>
          <div class="flex-1 ml-4">
            <h3
              class="text-xl font-medium mb-1.5 text-emerald-500 group-hover:text-emerald-600"
            >
              {{ user.username }}
            </h3>
            <div v-html="user.email"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="lg:hidden p-6">
      <div v-if="currentUser" class="group-content">
        <button
          @click="router.push('/users')"
          class="mb-6 text-emerald-500 hover:opacity-70 flex items-center gap-2"
        >
          ← Back to users
        </button>
        <h1 class="text-4xl font-bold mb-6">{{ currentUser.username }}</h1>
        <div class="text-lg leading-relaxed opacity-80" v-html="currentUser.email"></div>
      </div>
      <div v-else>
        <div
          v-for="user in visibleUsers"
          :key="user.id"
          @click="navigateToUser(user.name)"
          class="group mt-8 flex relative p-4 rounded-xl border-2 border-transparent cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500 hover:shadow-[0_8px_16px_rgba(16,185,129,0.2)]"
        >
          <EmojiContainer>
            {{user.role === 'ADMIN' ? '🛡️' : '👤'}}
          </EmojiContainer>
          <div class="flex-1 ml-4">
            <h3
              class="text-xl font-medium mb-1.5 text-emerald-500 group-hover:text-emerald-600"
            >
              {{ user.name }}
            </h3>
            <div class="text-sm opacity-70" v-html="user.email"></div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
