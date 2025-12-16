<script setup>
import CardFoundationComponent from './CardFoundationComponent.vue'

const props = defineProps({
  label1: {
    type: String,
    default: 'First Input',
  },
  label2: {
    type: String,
    default: 'Second Input',
  },
  placeholder1: {
    type: String,
    default: '',
  },
  placeholder2: {
    type: String,
    default: '',
  },
  modelValue1: {
    type: String,
    default: '',
  },
  modelValue2: {
    type: String,
    default: '',
  },
  type1: {
    type: String,
    default: 'text',
  },
  type2: {
    type: String,
    default: 'text',
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
  showEmoji: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue1', 'update:modelValue2'])

const handleInput1 = (event) => {
  emit('update:modelValue1', event.target.value)
}

const handleInput2 = (event) => {
  emit('update:modelValue2', event.target.value)
}
</script>

<template>
  <CardFoundationComponent :isActive="isActive" :variant="variant" :showEmoji="false">
    <div class="space-y-4 w-full">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="flex flex-col">
          <label class="text-sm font-medium mb-2 text-emerald-500">
            {{ label1 }}
          </label>
          <input
            :type="type1"
            :value="modelValue1"
            :placeholder="placeholder1"
            @input="handleInput1"
            class="w-full px-4 py-2 rounded-lg border-2 border-transparent bg-gray-100 dark:bg-gray-800 focus:outline-none focus:border-emerald-500 focus:bg-emerald-500/5 transition-all duration-200 hover:border-emerald-500/50"
          />
        </div>

        <div class="flex flex-col">
          <label class="text-sm font-medium mb-2 text-emerald-500">
            {{ label2 }}
          </label>
          <input
            :type="type2"
            :value="modelValue2"
            :placeholder="placeholder2"
            @input="handleInput2"
            class="w-full px-4 py-2 rounded-lg border-2 border-transparent bg-gray-100 dark:bg-gray-800 focus:outline-none focus:border-emerald-500 focus:bg-emerald-500/5 transition-all duration-200 hover:border-emerald-500/50"
          />
        </div>
      </div>

      <slot name="actions"></slot>
    </div>
  </CardFoundationComponent>
</template>
