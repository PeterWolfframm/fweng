<script setup></script>

<template>
  <main class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <div class="hidden lg:block w-full">
      <div class="p-8 max-w-7xl mx-auto">
        <slot name="desktop"></slot>
      </div>
    </div>

    <div class="lg:hidden p-6">
      <slot name="mobile"></slot>
    </div>
  </main>
</template>
