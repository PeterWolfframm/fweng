<template>
  <main class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <!-- Desktop Layout -->
    <div class="hidden lg:block w-full">
      <div class="px-8 py-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
        <h1 class="text-5xl font-bold mb-8 text-emerald-500">Login</h1>

        <form @submit.prevent="login" class="max-w-md space-y-8">
          <!-- Email -->
          <div>
            <label class="text-sm font-medium mb-2 text-emerald-500 block">
              Email
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="your.email@example.com"
              class="w-full px-4 py-3 rounded-lg border-2 border-transparent bg-gray-100 dark:bg-gray-800 focus:outline-none focus:border-emerald-500 focus:bg-emerald-500/5 transition-all duration-200 hover:border-emerald-500/50"
            />
          </div>

          <!-- Passwort -->
          <div>
            <label class="text-sm font-medium mb-2 text-emerald-500 block">
              Passwort
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              class="w-full px-4 py-3 rounded-lg border-2 border-transparent bg-gray-100 dark:bg-gray-800 focus:outline-none focus:border-emerald-500 focus:bg-emerald-500/5 transition-all duration-200 hover:border-emerald-500/50"
            />
          </div>

          <!-- Button -->
          <button 
            type="submit"
            class="w-full px-6 py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-500/30"
          >
            Einloggen
          </button>

          <!-- Error Display -->
          <ErrorDisplayComponent :message="errorMessage" />
        </form>

        <p class="mt-6 text-sm">
          Noch kein Konto?
          <RouterLink to="/register" class="text-emerald-500 hover:text-emerald-600 font-medium transition-colors">Registrieren</RouterLink>
        </p>
      </div>
    </div>

    <!-- Mobile Layout -->
    <div class="lg:hidden p-6">
      <h1 class="text-4xl font-bold mb-8 text-emerald-500">Login</h1>

      <form @submit.prevent="login" class="space-y-8">
        <!-- Email -->
        <div>
          <label class="text-sm font-medium mb-2 text-emerald-500 block">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="your.email@example.com"
            class="w-full px-4 py-3 rounded-lg border-2 border-transparent bg-gray-100 dark:bg-gray-800 focus:outline-none focus:border-emerald-500 focus:bg-emerald-500/5 transition-all duration-200 hover:border-emerald-500/50"
          />
        </div>

        <!-- Passwort -->
        <div>
          <label class="text-sm font-medium mb-2 text-emerald-500 block">
            Passwort
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full px-4 py-3 rounded-lg border-2 border-transparent bg-gray-100 dark:bg-gray-800 focus:outline-none focus:border-emerald-500 focus:bg-emerald-500/5 transition-all duration-200 hover:border-emerald-500/50"
          />
        </div>

        <!-- Button -->
        <button 
          type="submit"
          class="w-full px-6 py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-500/30"
        >
          Einloggen
        </button>

        <!-- Error Display -->
        <ErrorDisplayComponent :message="errorMessage" />
      </form>

      <p class="mt-6 text-sm">
        Noch kein Konto?
        <RouterLink to="/register" class="text-emerald-500 hover:text-emerald-600 font-medium transition-colors">Registrieren</RouterLink>
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ErrorDisplayComponent from '@/components/ErrorDisplayComponent.vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

// Login-Funktion
async function login() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await auth.login({
      emailOrUsername: email.value,
      password: password.value,
    })
    // Redirect to intended destination or default to home
    const redirectTo = route.query.redirect || '/'
    router.push(redirectTo)
  } catch (e) {
    console.error(e)
    errorMessage.value = e.message || 'Email oder Passwort falsch!'
  } finally {
    isLoading.value = false
  }
}
</script>
