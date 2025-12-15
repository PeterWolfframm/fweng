<template>
  <div>
    <h2>Join a Group</h2>
    <select v-model="selectedGroupId">
      <option v-for="group in groups" :key="group.id" :value="group.id">
        {{ group.name }}
      </option>
    </select>
    <button @click="joinGroup">Join Group</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGroupStore } from '@/stores/group'

const groupStore = useGroupStore()
const selectedGroupId = ref(null)

const joinGroup = () => {
  groupStore.joinGroup(selectedGroupId.value)
}
</script>
