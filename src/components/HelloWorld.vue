<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="">
    <h1 class="text-green-500 text-5xl">{{ msg }}</h1>
    <h3 class="text-gray-500 text-2xl mt-4">for shittalkers, by shittalkers.</h3>
  </div>
</template>
