<template>
  <div class="p-8 text-center">
    <h1 class="text-2xl font-bold mb-8">Login</h1>

    <form @submit.prevent="login">
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

      <!-- Button -->
      <div class="mb-4">
        <button class="btn btn-primary w-full max-w-xs">
          Einloggen
        </button>
      </div>
    </form>

    <p class="mt-6 text-sm">
      Noch kein Konto?
      <RouterLink to="/register" class="link link-primary">Registrieren</RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {useAuthStore} from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')


// Login-Funktion
function login() {
  try{
    auth.login({
      emailOrUsername: email.value,
      password: password.value,
    })
    auth.currentUser.value ={
      username: email.value,
      role: 'USER',
    }
    alert('Login erfolgreich!')

    router.push('/')
  } catch (e) {
    console.error(e) //fehler in der konsole anzeigen
    alert('Email oder Passwort falsch!')
  }
}
</script>

