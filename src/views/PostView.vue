<script setup>
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import TwoColumnLayout from "../components/TwoColumnLayout.vue";
import FullScreenWidth from "../components/FullScreenWidth.vue";
import PostPreviewCard from "../components/PostPreviewCard.vue";
import DetailHeader from "../components/DetailHeader.vue";

import { fetchPublicPosts, fetchGroupPosts } from "@/config/api";
import { useAuthStore } from "@/stores/auth";

import { getPosts, savePosts } from "../stores/postsStorage"; // <- savePosts brauchst du!

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const posts = ref([]);

// 1) Beim Laden: zuerst aus localStorage anzeigen (schnell)
// 2) Danach API holen und localStorage + UI aktualisieren
onMounted(async () => {
  posts.value = getPosts() || [];

  try {
    const response = auth.isLoggedIn
      ? await fetchGroupPosts()
      : await fetchPublicPosts();

    posts.value = response.data;

    // im storage merken, damit du nach logout noch public posts sehen kannst
    savePosts(posts.value);
  } catch (e) {
    console.error("Failed to load posts:", e);
  }
});

// wenn deine Route /posts/:id ist:
const currentPost = computed(() => {
  const id = route.params.id;
  if (!id) return null;
  return posts.value.find(p => String(p.id) === String(id)) || null;
});
</script>

<template>
  <TwoColumnLayout v-if="currentPost">
    <template #sidebar>
      <PostPreviewCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        :isActive="currentPost && currentPost.id === post.id"
        variant="sidebar"
        contentClass="text-sm opacity-70"
      />
    </template>

    <template #main>
      <!-- ACHTUNG: bei dir heißt es body, nicht content -->
      <DetailHeader :title="currentPost.title" :description="currentPost.body" variant="main" />
    </template>

    <template #mobile>
      <div class="post-content">
        <button
          @click="router.push('/posts')"
          class="mb-6 text-emerald-500 hover:opacity-70 flex items-center gap-2"
        >
          ← Back to Posts
        </button>
        <DetailHeader :title="currentPost.title" :description="currentPost.body" variant="mobile" />
      </div>
    </template>
  </TwoColumnLayout>

  <FullScreenWidth v-else>
    <template #desktop>
      <PostPreviewCard v-for="post in posts" :key="post.id" :post="post" variant="main" />
    </template>

    <template #mobile>
      <PostPreviewCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        variant="mobile"
        contentClass="text-sm opacity-70"
      />
    </template>
  </FullScreenWidth>
</template>
