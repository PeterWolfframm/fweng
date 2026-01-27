<script setup></script>

<template>
  <main class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <div class="hidden lg:block w-full">
      <div class="px-8 py-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
        <slot name="desktop"></slot>
      </div>
    </div>

    <div class="lg:hidden p-6">
      <slot name="mobile"></slot>
    </div>
  </main>
</template>
