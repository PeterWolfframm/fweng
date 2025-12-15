<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroupStore } from '@/stores/group' // Correct import
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import EmojiContainer from '../components/EmojiContainer.vue'

// Get the group store instance
const groupStore = useGroupStore()
const auth = useAuthStore()

// Current route
const route = useRoute()
const router = useRouter()

// Computed group to access the group based on the route
const currentGroup = computed(() => {
  const name = route.params.name
  if (!name) return null
  return groupStore.groups.find(group => group.name === name) || null
})

// Navigation to a specific group
const navigateToGroup = (name) => {
  router.push(`/groups/${encodeURIComponent(name)}`)
}

// Form handling for creating a group
const groupName = ref('')
const groupDescription = ref('')

const createGroup = () => {
  if (groupName.value.trim() && groupDescription.value.trim()) {
    groupStore.createGroup(groupName.value, groupDescription.value)
    groupName.value = ''
    groupDescription.value = ''
    alert('Group created successfully!')
  } else {
    alert('Please fill in all fields!')
  }
}
</script>

<template>
   <main class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <!-- Create New Group Form -->
    <div v-if="auth.isLoggedIn" class="p-8">
      <h2 class="text-2xl mb-4">Create New Group</h2>
      <form @submit.prevent="createGroup">
        <div class="mb-4">
          <input v-model="groupName" type="text" placeholder="Group Name" class="input input-bordered w-full max-w-xs" required style="height: 40px; font-size: 1rem; padding: 8px;" />
        </div>
        <div class="mb-4">
          <textarea v-model="groupDescription" placeholder="Group Description" class="textarea input-bordered w-full max-w-xs" required style="font-size: 1rem; padding: 8px;"></textarea>
        </div>
        <button class="btn btn-primary w-full max-w-xs" style="padding: 10px 20px; font-size: 1rem;">Create Group</button>
      </form>
    </div>

    <div v-if="currentGroup" class="hidden lg:flex w-full h-[calc(100vh-5rem)]">
      <aside class="w-1.5/3 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
        <div class="w-full p-8">
          <div
            v-for="group in groupStore.groups"
            :key="group.id"
            @click="navigateToGroup(group.name)"
            class="group mt-8 flex relative p-4 rounded-xl border-2 cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500 hover:shadow-[0_8px_16px_rgba(16,185,129,0.2)]
             lg:mt-0 lg:py-6 lg:px-4 lg:pl-20 before:content-[''] before:border-l before:border-gray-300 dark:before:border-gray-700 before:absolute before:left-0 before:bottom-[calc(50%+25px)] before:h-[calc(50%-25px)] before:hidden before:lg:block after:content-[''] after:border-l after:border-gray-300 dark:after:border-gray-700 after:absolute after:left-0 after:top-[calc(50%+25px)] after:h-[calc(50%-25px)] after:hidden after:lg:block first:before:hidden! last:after:hidden!"
            :class="
              currentGroup && currentGroup.name === group.name
                ? 'bg-emerald-500/10 border-emerald-500'
                : 'border-transparent'
            "
          >
            <EmojiContainer>
              {{ group.icon }}
            </EmojiContainer>
            <div class="flex-1 ml-4">
              <h3
                class="text-xl font-medium mb-1.5 text-emerald-500 group-hover:text-emerald-600"
              >
                {{ group.name }}
              </h3>
              <div class="text-sm opacity-70" v-html="group.content"></div>
            </div>
          </div>
        </div>
      </aside>

      <div class="flex-1 w-2/3 overflow-y-auto">
        <div class="p-8">
          <div class="post-content max-w-4xl">
            <h1 class="text-5xl font-bold mb-8">{{ currentGroup.name }}</h1>
            <div class="text-xl leading-relaxed opacity-80" v-html="currentGroup.description"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="hidden lg:block w-full">
      <div class="p-8 max-w-7xl mx-auto">
        <div
          v-for="group in groupStore.groups"
          :key="group.id"
          @click="navigateToGroup(group.name)"
          class="group mt-8 flex relative p-4 rounded-xl border-2 border-transparent cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500 hover:shadow-[0_8px_16px_rgba(16,185,129,0.2)] lg:mt-0 lg:py-6 lg:px-4 lg:pl-10 before:content-[''] before:border-l before:border-gray-300 dark:before:border-gray-700 before:absolute before:left-0 before:bottom-[calc(50%+25px)] before:h-[calc(50%-25px)] before:hidden before:lg:block after:content-[''] after:border-l after:border-gray-300 dark:after:border-gray-700 after:absolute after:left-0 after:top-[calc(50%+25px)] after:h-[calc(50%-25px)] after:hidden after:lg:block first:before:hidden! last:after:hidden!"
        >
          <EmojiContainer>
            {{ group.icon }}
          </EmojiContainer>
          <div class="flex-1 ml-4">
            <h3
              class="text-xl font-medium mb-1.5 text-emerald-500 group-hover:text-emerald-600"
            >
              {{ group.name }}
            </h3>
            <div v-html="group.description"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="lg:hidden p-8">
      <div v-if="currentGroup" class="group-content">
        <button
          @click="router.push('/groups')"
          class="mb-6 text-emerald-500 hover:opacity-70 flex items-center gap-2"
        >
          ← Back to articles
        </button>
        <h1 class="text-4xl font-bold mb-6">{{ currentGroup.name }}</h1>
        <div class="text-lg leading-relaxed opacity-80" v-html="currentGroup.description"></div>
      </div>
      <div v-else>
        <div
          v-for="group in groupStore.groups"
          :key="group.id"
          @click="navigateToGroup(group.name)"
          class="group mt-8 flex relative p-4 rounded-xl border-2 border-transparent cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500 hover:shadow-[0_8px_16px_rgba(16,185,129,0.2)]"
        >
          <EmojiContainer>
            {{ group.icon }}
          </EmojiContainer>
          <div class="flex-1 ml-4">
            <h3
              class="text-xl font-medium mb-1.5 text-emerald-500 group-hover:text-emerald-600"
            >
              {{ group.name }}
            </h3>
            <div class="text-sm opacity-70" v-html="group.description"></div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
