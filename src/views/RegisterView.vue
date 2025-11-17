<template>
  <div class="p-8 text-center">
    <h1 class="text-2xl font-bold mb-8">Registrieren</h1>

    <form @submit.prevent="register">
      <!-- Name -->
      <div class="mb-4">
        <input
          v-model="name"
          type="text"
          placeholder="Name"
          class="input input-bordered w-full max-w-xs"
        />
      </div>

      <!-- Email -->
      <div class="mb-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="input input-bordered w-full max-w-xs"
        />
      </div>

      <!-- Passwort -->
      <div class="mb-4">
        <input
          v-model="password"
          type="password"
          placeholder="Passwort"
          class="input input-bordered w-full max-w-xs"
        />
      </div>

      <!-- Registrieren Button -->
      <div class="mb-4">
        <button class="btn btn-primary w-full max-w-xs">
          Registrieren
        </button>
      </div>
    </form>

    <p class="mt-6 text-sm">
      Schon ein Konto?
      <RouterLink to="/login" class="link link-primary">Login</RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')

function register() {
  alert(`Registriert: ${name.value}, ${email.value}`)
}
</script>
