<template>
  <dialog ref="modalRef" class="modal backdrop:bg-black/50 flex items-center justify-center">
    <div class="bg-base-100 rounded-xl border-2 border-emerald-500 shadow-[0_8px_24px_rgba(16,185,129,0.3)] p-6 max-w-md w-full mx-4">
      <h3 class="text-2xl font-bold mb-4 text-emerald-500">{{ title }}</h3>
      <p class="text-base mb-6 leading-relaxed">{{ message }}</p>
      <div class="flex justify-end">
        <form method="dialog">
          <button class="btn btn-primary px-6">Close</button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  title: {
    type: String,
    default: 'Error'
  },
  message: {
    type: String,
    default: 'An error occurred'
  }
})

const modalRef = ref(null)

const openModal = () => {
  modalRef.value?.showModal()
}

const closeModal = () => {
  modalRef.value?.close()
}

defineExpose({
  openModal,
  closeModal
})
</script>


