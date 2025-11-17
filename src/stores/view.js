import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useViewStore = defineStore('view', () => {
  const isYapVisible = ref(true)

  function toggleYapVisibility() {
    isYapVisible.value = !isYapVisible.value
  }

  function setYapVisibility(visible) {
    isYapVisible.value = visible
  }

  return { isYapVisible, toggleYapVisibility, setYapVisibility }
})
