<script setup>
import EmojiContainer from './EmojiContainer.vue'
</script>

<template>
  <div
    class="item mt-8 flex relative p-4 rounded-xl border-2 border-transparent transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1 hover:bg-(--color-primary-light) hover:border-(--color-primary) hover:shadow-[0_8px_16px_rgba(16,185,129,0.2)] lg:mt-0 lg:py-6 lg:px-4 lg:pl-[calc(var(--section-gap)/2)]"
  >
    <EmojiContainer>
      <slot name="icon"></slot>
    </EmojiContainer>
    <div class="flex-1 ml-4">
      <h3
        class="text-xl font-medium mb-1.5 text-(--color-heading) transition-colors duration-300 ease-in-out group-hover:text-(--color-primary)"
      >
        <slot name="heading"></slot>
      </h3>
      <slot></slot>
    </div>
  </div>
</template>

<style>
.item:hover h3 {
  color: var(--color-primary, var(--color-heading));
}

@media (min-width: 1024px) {
  .item:before {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    bottom: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:after {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    top: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:first-of-type:before {
    display: none;
  }

  .item:last-of-type:after {
    display: none;
  }
}
</style>
