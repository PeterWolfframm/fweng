<script setup>
</script>

<template>
  <main class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <div class="hidden lg:flex w-full h-[calc(100vh-5rem)]">
      <aside class="w-1/3 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
        <div class="w-full p-8">
          <slot name="sidebar"></slot>
        </div>
      </aside>

      <div class="flex-1 w-2/3 overflow-y-auto">
        <div class="p-8">
          <slot name="main"></slot>
        </div>
      </div>
    </div>

    <div class="lg:hidden p-6">
      <slot name="mobile"></slot>
    </div>
  </main>
</template>

