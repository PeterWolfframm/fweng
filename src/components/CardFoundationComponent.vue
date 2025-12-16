<script setup>
import EmojiContainer from './EmojiContainer.vue'

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'main',
    validator: (value) => ['sidebar', 'main', 'mobile'].includes(value),
  },
  contentClass: {
    type: String,
    default: '',
  },
  showEmoji: {
    type: Boolean,
    default: true,
  },
})

const getBaseClasses = () => {
  const base =
    'group flex relative w-full p-4 rounded-xl border-2 cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500 hover:shadow-[0_8px_16px_rgba(16,185,129,0.2)]'

  const variantClasses = {
    sidebar:
      "mt-8 lg:mt-0 lg:py-6 lg:px-4 before:content-[''] before:border-l-2 before:border-gray-400 dark:before:border-gray-600 before:absolute before:left-0 before:bottom-[calc(50%+25px)] before:h-[calc(50%-25px)] before:hidden before:lg:block after:content-[''] after:border-l-2 after:border-gray-400 dark:after:border-gray-600 after:absolute after:left-0 after:top-[calc(50%+25px)] after:h-[calc(50%-25px)] after:hidden after:lg:block first:before:hidden! last:after:hidden!",
    main: "mt-8 lg:mt-0 lg:py-6 lg:px-4 before:content-[''] before:border-l-2 before:border-gray-400 dark:before:border-gray-600 before:absolute before:left-0 before:bottom-[calc(50%+25px)] before:h-[calc(50%-25px)] before:hidden before:lg:block after:content-[''] after:border-l-2 after:border-gray-400 dark:after:border-gray-600 after:absolute after:left-0 after:top-[calc(50%+25px)] after:h-[calc(50%-25px)] after:hidden after:lg:block first:before:hidden! last:after:hidden!",
    mobile: 'mt-8',
  }

  const emojiPadding = props.showEmoji ? 'lg:pl-20' : ''

  return `${base} ${variantClasses[props.variant]} ${emojiPadding}`
}

const getBorderClasses = () => {
  return props.isActive ? 'bg-emerald-500/10 border-emerald-500' : 'border-transparent'
}
</script>

<template>
  <div :class="[getBaseClasses(), getBorderClasses()]">
    <EmojiContainer v-if="showEmoji">
      <slot name="emoji"></slot>
    </EmojiContainer>
    <div :class="['flex-1', showEmoji ? 'ml-4' : '']">
      <slot></slot>
    </div>
  </div>
</template>
