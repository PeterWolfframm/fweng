import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useViewStore = defineStore('view', () => {
  // true = yap/articles side-by-side (or article list/article side-by-side)
  // false = full-screen article list (or article list/article)
  const isYapVisible = ref(true)

  function toggleYapVisibility() {
    isYapVisible.value = !isYapVisible.value
  }

  function setYapVisibility(visible) {
    isYapVisible.value = visible
  }

  return { isYapVisible, toggleYapVisibility, setYapVisibility }
})
