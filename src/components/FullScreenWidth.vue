<script setup></script>

<template>
  <main class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <div class="hidden lg:block w-full">
      <div class="px-6 py-8 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <slot name="desktop"></slot>
      </div>
    </div>

    <div class="lg:hidden p-6">
      <slot name="mobile"></slot>
    </div>
  </main>
</template>
