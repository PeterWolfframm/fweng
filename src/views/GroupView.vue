<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GroupPreviewCard from '../components/GroupPreviewCard.vue'
import groups from '../groups.json'

const route = useRoute()
const router = useRouter()

const currentGroup = computed(() => {
  const name = route.params.name
  if (!name) return null
  return groups.find((group) => group.name === name)
})
</script>

<template>
  <main class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <div v-if="currentGroup" class="hidden lg:flex w-full h-[calc(100vh-5rem)]">
      <aside class="w-1/3 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
        <div class="w-full p-8">
          <GroupPreviewCard
            v-for="group in groups"
            :key="group.id"
            :group="group"
            :isActive="currentGroup && currentGroup.name === group.name"
            variant="sidebar"
            contentClass="text-sm opacity-70"
          />
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
        <GroupPreviewCard
          v-for="group in groups"
          :key="group.id"
          :group="group"
          variant="main"
        />
      </div>
    </div>

    <div class="lg:hidden p-6">
      <div v-if="currentGroup" class="group-content">
        <button
          @click="router.push('/groups')"
          class="mb-6 text-emerald-500 hover:opacity-70 flex items-center gap-2"
        >
          ← Back to groups
        </button>
        <h1 class="text-4xl font-bold mb-6">{{ currentGroup.name }}</h1>
        <div class="text-lg leading-relaxed opacity-80" v-html="currentGroup.description"></div>
      </div>
      <div v-else>
        <GroupPreviewCard
          v-for="group in groups"
          :key="group.id"
          :group="group"
          variant="mobile"
          contentClass="text-sm opacity-70"
        />
      </div>
    </div>
  </main>
</template>
