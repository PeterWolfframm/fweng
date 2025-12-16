<script setup>
import DetailHeader from '../components/DetailHeader.vue'
</script>

<template>
  <div class="space-y-0">
    <DetailHeader
      title="Profile History"
      description="View your account activity and history."
      variant="main"
    />

    <div
      class="p-6 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
    >
      <p class="text-slate-600 dark:text-slate-400">Your profile history will appear here.</p>
    </div>
  </div>
</template>
