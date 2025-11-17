<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
}

const applyTheme = (dark, saveToStorage = true) => {
  const html = document.documentElement
  if (dark) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
  if (saveToStorage) {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
    applyTheme(isDark.value, false)
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(isDark.value, false)

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        isDark.value = e.matches
        applyTheme(e.matches, false)
      }
    })
  }
})
</script>

<template>
  <button
    @click="toggleTheme"
    class="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 cursor-pointer text-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    title="Toggle theme"
  >
    <span v-if="isDark">☀️</span>
    <span v-else>🌙</span>
  </button>
</template>
