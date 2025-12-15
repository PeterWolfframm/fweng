<script setup>
import EmojiContainer from './EmojiContainer.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  group: {
    type: Object,
    required: true,
  },
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
})

const router = useRouter()

const navigateToGroup = () => {
  router.push(`/groups/${encodeURIComponent(props.group.name)}`)
}

const getBaseClasses = () => {
  const base =
    'group flex relative p-4 rounded-xl border-2 cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500 hover:shadow-[0_8px_16px_rgba(16,185,129,0.2)]'

  const variantClasses = {
    sidebar:
      "mt-8 lg:mt-0 lg:py-6 lg:px-4 lg:pl-20 before:content-[''] before:border-l before:border-gray-300 dark:before:border-gray-700 before:absolute before:left-0 before:bottom-[calc(50%+25px)] before:h-[calc(50%-25px)] before:hidden before:lg:block after:content-[''] after:border-l after:border-gray-300 dark:after:border-gray-700 after:absolute after:left-0 after:top-[calc(50%+25px)] after:h-[calc(50%-25px)] after:hidden after:lg:block first:before:hidden! last:after:hidden!",
    main: "mt-8 lg:mt-0 lg:py-6 lg:px-4 lg:pl-20 before:content-[''] before:border-l before:border-gray-300 dark:before:border-gray-700 before:absolute before:left-0 before:bottom-[calc(50%+25px)] before:h-[calc(50%-25px)] before:hidden before:lg:block after:content-[''] after:border-l after:border-gray-300 dark:after:border-gray-700 after:absolute after:left-0 after:top-[calc(50%+25px)] after:h-[calc(50%-25px)] after:hidden after:lg:block first:before:hidden! last:after:hidden!",
    mobile: 'mt-8',
  }

  return `${base} ${variantClasses[props.variant]}`
}

const getBorderClasses = () => {
  return props.isActive ? 'bg-emerald-500/10 border-emerald-500' : 'border-transparent'
}
</script>

<template>
  <div @click="navigateToGroup" :class="[getBaseClasses(), getBorderClasses()]">
    <EmojiContainer>
      {{ group.icon }}
    </EmojiContainer>
    <div class="flex-1 ml-4">
      <h3 class="text-xl font-medium mb-1.5 text-emerald-500 group-hover:text-emerald-600">
        {{ group.name }}
      </h3>
      <div :class="contentClass" class="text-sm opacity-70" v-html="group.description"></div>
    </div>
  </div>
</template>

