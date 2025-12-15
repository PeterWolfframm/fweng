<template>
  <main class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <!-- Desktop Layout (2-column) -->
    <div class="hidden lg:block w-full">
      <div class="p-8 max-w-7xl mx-auto">
        <h1 class="text-5xl font-bold mb-8">Login</h1>

        <form @submit.prevent="login" class="max-w-md">
          <!-- Email -->
          <div class="mb-4">
            <input
              v-model="email"
              type="email"
              placeholder="Email"
              class="input input-bordered w-full"
            />
          </div>

          <!-- Passwort -->
          <div class="mb-4">
            <input
              v-model="password"
              type="password"
              placeholder="Passwort"
              class="input input-bordered w-full"
            />
          </div>

          <!-- Button -->
          <div class="mb-4">
            <button class="btn btn-primary w-full">Einloggen</button>
          </div>
        </form>

        <p class="mt-6 text-sm">
          Noch kein Konto?
          <RouterLink to="/register" class="link link-primary">Registrieren</RouterLink>
        </p>
      </div>
    </div>

    <!-- Mobile Layout -->
    <div class="lg:hidden p-6">
      <h1 class="text-4xl font-bold mb-8">Login</h1>

      <form @submit.prevent="login">
        <!-- Email -->
        <div class="mb-4">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="input input-bordered w-full"
          />
        </div>

        <!-- Passwort -->
        <div class="mb-4">
          <input
            v-model="password"
            type="password"
            placeholder="Passwort"
            class="input input-bordered w-full"
          />
        </div>

        <!-- Button -->
        <div class="mb-4">
          <button class="btn btn-primary w-full">Einloggen</button>
        </div>
      </form>

      <p class="mt-6 text-sm">
        Noch kein Konto?
        <RouterLink to="/register" class="link link-primary">Registrieren</RouterLink>
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Demo-User
const demoUser = {
  email: 'wi23b010@technikum.at',
  password: 'Test1234',
}

const email = ref('')
const password = ref('')

// Login-Funktion
function login() {
  if (email.value === demoUser.email && password.value === demoUser.password) {
    alert('Login erfolgreich!')
    router.push('/') // Weiterleitung zur Startseite
  } else {
    alert('Email oder Passwort falsch!')
  }
}
</script>
