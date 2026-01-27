<script setup>
import { ref, onMounted } from 'vue'
import TwoColumnLayout from '../components/TwoColumnLayout.vue'
import PostPreviewCard from '../components/PostPreviewCard.vue'
import GroupPreviewCard from '../components/GroupPreviewCard.vue'
import groups from '../groups.json'
import { useAuthStore } from '@/stores/auth'
import { fetchPublicPosts, fetchFeedPosts } from '@/config/api'
import { watch } from 'vue'

const auth = useAuthStore()
const firstThreeGroups = groups.slice(0, 3)

// Reactive state for posts
const articles = ref([])
const loading = ref(true)
const error = ref(null)

// Fetch posts on component mount
async function loadPosts() {
  loading.value = true;
  error.value = null;

  try {
    const response = auth.isLoggedIn
      ? await fetchFeedPosts()
      : await fetchPublicPosts();

    articles.value = (response.data ?? []).map((post) => ({
      id: post.id,
      title: post.title,
      content: post.body,
      icon: "💬",
      createdAt: post.createdAt,
      visibility: post.visibility,
    }));
  } catch (err) {
    console.error("Failed to load posts:", err);
    error.value =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to load posts.";
  } finally {
    loading.value = false;
  }
}

onMounted(loadPosts);

watch(() => auth.isLoggedIn, () => {
  loadPosts();
});

</script>

<template>
  <TwoColumnLayout>
    <template #sidebar>
      <div class="px-0 pt-0">
        <h1 class="text-6xl font-bold mb-2">🗣️ yap.</h1>
        <div class="mt-12">
          <GroupPreviewCard
            v-for="group in firstThreeGroups"
            :key="group.id"
            :group="group"
            variant="sidebar"
          />
        </div>
      </div>
    </template>

    <template #main>
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">Loading posts...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-500 dark:text-red-400 mb-2">{{ error }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Could not load posts right now.
        </p>
      </div>

      <!-- Empty State -->
      <div v-else-if="articles.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No posts available yet.</p>
      </div>

      <!-- Posts List -->
      <PostPreviewCard
        v-else
        v-for="article in articles"
        :key="article.id"
        :post="article"
        variant="main"
      />
    </template>

    <template #mobile>
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">Loading posts...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-500 dark:text-red-400 mb-2">{{ error }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Please make sure you're logged in to view posts.
        </p>
      </div>

      <!-- Empty State -->
      <div v-else-if="articles.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No posts available yet.</p>
      </div>

      <!-- Posts List -->
      <PostPreviewCard
        v-else
        v-for="article in articles"
        :key="article.id"
        :post="article"
        variant="mobile"
      />
    </template>
  </TwoColumnLayout>
</template>
