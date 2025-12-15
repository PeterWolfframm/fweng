<script setup>
// This component provides a reusable two-column layout with:
// - Left sidebar (1/3 width, sticky)
// - Right main content (2/3 width, scrollable)
// - Mobile-responsive with separate mobile slot
</script>

<template>
  <main class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <!-- Desktop Two-Column Layout -->
    <div class="hidden lg:flex w-full h-[calc(100vh-5rem)]">
      <!-- Left Sidebar -->
      <aside class="w-1/3 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
        <div class="w-full p-8">
          <slot name="sidebar"></slot>
        </div>
      </aside>

      <!-- Right Main Content -->
      <div class="flex-1 w-2/3 overflow-y-auto">
        <div class="p-8">
          <slot name="main"></slot>
        </div>
      </div>
    </div>

    <!-- Mobile Layout -->
    <div class="lg:hidden p-6">
      <slot name="mobile"></slot>
    </div>
  </main>
</template>

