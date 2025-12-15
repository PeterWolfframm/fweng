<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroupStore } from '@/stores/group' // Correct import
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

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
    <!-- Display Groups -->
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-8">Groups</h2>
      <div v-for="group in groupStore.groups" :key="group.id" class="group mt-8 flex relative p-4 rounded-xl border-2 cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500 hover:shadow-[0_8px_16px_rgba(16,185,129,0.2)]" @click="navigateToGroup(group.name)">
        <div class="flex-1 ml-4">
          <h3 class="text-xl font-medium mb-1.5 text-emerald-500 group-hover:text-emerald-600">{{ group.name }}</h3>
          <p class="text-sm opacity-70">{{ group.description }}</p>
        </div>
      </div>
    </div>

    <!-- Create New Group Form -->
    <div v-if="auth.isLoggedIn" class="p-8">
      <h2 class="text-2xl mb-4">Create New Group</h2>
      <form @submit.prevent="createGroup">
        <div class="mb-4">
          <input v-model="groupName" type="text" placeholder="Group Name" class="input input-bordered w-full max-w-xs" required />
        </div>
        <div class="mb-4">
          <textarea v-model="groupDescription" placeholder="Group Description" class="textarea input-bordered w-full max-w-xs" required></textarea>
        </div>
        <button class="btn btn-primary w-full max-w-xs">Create Group</button>
      </form>
    </div>

    <!-- Group Details -->
    <div v-if="currentGroup" class="p-8">
      <h2 class="text-4xl mb-4">{{ currentGroup.name }}</h2>
      <p class="text-lg mb-4">{{ currentGroup.description }}</p>
      <p><strong>Members:</strong> {{ currentGroup.members.join(', ') }}</p>
    </div>
  </main>
</template>
