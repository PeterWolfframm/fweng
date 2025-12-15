<template>
  <div>
    <h2>Create a Group</h2>
    <form @submit.prevent="createGroup">
      <input v-model="groupName" placeholder="Group Name" />
      <textarea v-model="groupDescription" placeholder="Group Description"></textarea>
      <button type="submit">Create Group</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGroupStore } from '@/stores/group'

const groupStore = useGroupStore()

const groupName = ref('')
const groupDescription = ref('')

const createGroup = () => {
  groupStore.createGroup(groupName.value, groupDescription.value)
}
</script>
