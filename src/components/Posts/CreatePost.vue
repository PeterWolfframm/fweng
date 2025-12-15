<template>
  <div>
    <h2>Create a Post</h2>
    <form @submit.prevent="createPost">
      <input v-model="title" placeholder="Title" />
      <textarea v-model="content" placeholder="Content"></textarea>

      <label>
        Private:
        <input type="checkbox" v-model="privatePost" />
      </label>

      <select v-model="selectedGroupId">
        <option v-for="group in groups" :key="group.id" :value="group.id">
          {{ group.name }}
        </option>
      </select>

      <button type="submit">Create Post</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePostStore } from '@/stores/post'
import { useGroupStore } from '@/stores/group'

const postStore = usePostStore()
const groupStore = useGroupStore()

const title = ref('')
const content = ref('')
const privatePost = ref(false)
const selectedGroupId = ref(null)

const createPost = () => {
  const newPost = {
    title: title.value,
    body: content.value,
    private: privatePost.value,
    author: groupStore.currentUser.username,
  }

  postStore.createPost(newPost)

  // Add the post to the selected group
  groupStore.addPostToGroup(selectedGroupId.value, newPost)
}
</script>
