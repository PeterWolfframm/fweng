<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { fetchPublicPosts, fetchMyPosts, fetchGroupPosts } from "@/config/api";

import FullScreenWidth from "../components/FullScreenWidth.vue";
import PostPreviewCard from "../components/PostPreviewCard.vue";

const auth = useAuthStore();

const publicPosts = ref([]);
const myPosts = ref([]);        // <- meine Posts (egal ob PUBLIC/PRIVATE)
const groupPosts = ref([]);     // <- Posts aus meinen Gruppen (meist PRIVATE)
const loading = ref(false);
const error = ref(null);

async function loadPosts() {
  loading.value = true;
  error.value = null;

  try {
    // Public immer
    const pubRes = await fetchPublicPosts();
    publicPosts.value = pubRes.data;

    if (auth.isLoggedIn) {
      // Meine Posts
      const myRes = await fetchMyPosts();
      myPosts.value = myRes.data;

      // Gruppenposts (falls dein Endpoint existiert)
      const grpRes = await fetchGroupPosts();
      groupPosts.value = grpRes.data;
    } else {
      myPosts.value = [];
      groupPosts.value = [];
    }
  } catch (e) {
    console.error("LOAD POSTS ERROR:", e);
    console.error("STATUS:", e?.response?.status);
    console.error("DATA:", e?.response?.data);

    error.value = `Posts konnten nicht geladen werden. (Status: ${e?.response?.status || "?"})`;
  } finally {
    loading.value = false;
  }
}

onMounted(loadPosts);
</script>

<template>
  <div v-if="loading" class="text-center py-8 text-gray-500 dark:text-gray-400">
    Loading posts...
  </div>

  <div v-else-if="error" class="text-center py-8 text-red-500 dark:text-red-400">
    {{ error }}
  </div>

  <FullScreenWidth v-else>
    <template #desktop>
      <div v-if="auth.isLoggedIn" class="mb-10">
        <h2 class="text-xl font-bold mb-4">My posts (private)</h2>

        <div v-if="myPosts.length === 0" class="text-gray-500 dark:text-gray-400 mb-6">
          No posts of your own.
        </div>

        <PostPreviewCard
          v-for="post in myPosts"
          :key="post.id"
          :post="post"
          variant="main"
        />

        <br>
        <h2 class="text-xl font-bold mt-10 mb-4">Private posts (groups)</h2>

        <div v-if="groupPosts.length === 0" class="text-gray-500 dark:text-gray-400">
          No group-posts (or you are not in a group).
        </div><br>

        <PostPreviewCard
          v-for="post in groupPosts"
          :key="post.id"
          :post="post"
          variant="main"
        />
      </div>

      <div>
        <h2 class="text-xl font-bold mb-4">Public posts</h2>

        <div v-if="publicPosts.length === 0" class="text-gray-500 dark:text-gray-400">
          No public posts.
        </div>

        <PostPreviewCard
          v-for="post in publicPosts"
          :key="post.id"
          :post="post"
          variant="main"
        />
      </div>
    </template>

    <template #mobile>
      <!-- gleiches Layout mobile (kannst du 1:1 kopieren) -->
      <div v-if="auth.isLoggedIn" class="mb-10">
        <h2 class="text-lg font-bold mb-3">My posts</h2>
        <div v-if="myPosts.length === 0" class="text-gray-500 dark:text-gray-400 mb-6">
          No posts of yours found.
        </div>
        <PostPreviewCard v-for="post in myPosts" :key="post.id" :post="post" variant="mobile" />
        <h2 class="text-lg font-bold mt-8 mb-3">Private posts (groups)</h2>
        <div v-if="groupPosts.length === 0" class="text-gray-500 dark:text-gray-400">
          No group-posts.
        </div>
        <PostPreviewCard v-for="post in groupPosts" :key="post.id" :post="post" variant="mobile" />
      </div>

      <div>
        <h2 class="text-lg font-bold mb-3">Public posts</h2>
        <div v-if="publicPosts.length === 0" class="text-gray-500 dark:text-gray-400">
          No public posts.
        </div>
        <PostPreviewCard v-for="post in publicPosts" :key="post.id" :post="post" variant="mobile" />
      </div>
    </template>
  </FullScreenWidth>
</template>
