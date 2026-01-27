<template>
  <main class="relative w-full p-0 m-0 max-w-full overflow-x-hidden">
    <div class="hidden lg:block w-full">
      <div class="px-6 py-8 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <h1 class="text-5xl font-bold mb-8 text-emerald-500">Registrieren</h1>

        <form @submit.prevent="register" class="max-w-2xl space-y-8">
          <div>
            <label class="text-sm font-medium mb-2 text-emerald-500 block">
              Username
            </label>
            <input
              v-model="name"
              type="text"
              placeholder="Enter your username"
              class="w-full px-4 py-3 rounded-lg border-2 border-transparent bg-gray-100 dark:bg-gray-800 focus:outline-none focus:border-emerald-500 focus:bg-emerald-500/5 transition-all duration-200 hover:border-emerald-500/50"
            />
            <p v-if="errors.name" class="text-red-600 dark:text-red-400 text-sm mt-1">{{ errors.name }}</p>
          </div>

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
            <p v-if="errors.email" class="text-red-600 dark:text-red-400 text-sm mt-1">{{ errors.email }}</p>
          </div>

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
            <p v-if="errors.password" class="text-red-600 dark:text-red-400 text-sm mt-1">{{ errors.password }}</p>
          </div>

          <div>
            <label class="text-sm font-medium mb-2 text-emerald-500 block">
              Repeat Password
            </label>
            <input
              v-model="repeatPassword"
              type="password"
              placeholder="Confirm your password"
              class="w-full px-4 py-3 rounded-lg border-2 border-transparent bg-gray-100 dark:bg-gray-800 focus:outline-none focus:border-emerald-500 focus:bg-emerald-500/5 transition-all duration-200 hover:border-emerald-500/50"
            />
            <p v-if="errors.repeatPassword" class="text-red-600 dark:text-red-400 text-sm mt-1">{{ errors.repeatPassword }}</p>
          </div>

          <button 
            type="submit"
            class="w-full px-6 py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-500/30"
          >
            Registrieren
          </button>

          <ErrorDisplayComponent :message="errors.general" />
        </form>

        <p class="mt-6 text-sm">
          Schon ein Konto?
          <RouterLink to="/login" class="text-emerald-500 hover:text-emerald-600 font-medium transition-colors">Login</RouterLink>
        </p>
      </div>
    </div>

    <div class="lg:hidden p-6">
      <h1 class="text-4xl font-bold mb-8 text-emerald-500">Registrieren</h1>

      <form @submit.prevent="register" class="space-y-8">
        <div>
          <label class="text-sm font-medium mb-2 text-emerald-500 block">
            Username
          </label>
          <input
            v-model="name"
            type="text"
            placeholder="Enter your username"
            class="w-full px-4 py-3 rounded-lg border-2 border-transparent bg-gray-100 dark:bg-gray-800 focus:outline-none focus:border-emerald-500 focus:bg-emerald-500/5 transition-all duration-200 hover:border-emerald-500/50"
          />
          <p v-if="errors.name" class="text-red-600 dark:text-red-400 text-sm mt-1">{{ errors.name }}</p>
        </div>

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
          <p v-if="errors.email" class="text-red-600 dark:text-red-400 text-sm mt-1">{{ errors.email }}</p>
        </div>

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
          <p v-if="errors.password" class="text-red-600 dark:text-red-400 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <div>
          <label class="text-sm font-medium mb-2 text-emerald-500 block">
            Repeat Password
          </label>
          <input
            v-model="repeatPassword"
            type="password"
            placeholder="Confirm your password"
            class="w-full px-4 py-3 rounded-lg border-2 border-transparent bg-gray-100 dark:bg-gray-800 focus:outline-none focus:border-emerald-500 focus:bg-emerald-500/5 transition-all duration-200 hover:border-emerald-500/50"
          />
          <p v-if="errors.repeatPassword" class="text-red-600 dark:text-red-400 text-sm mt-1">{{ errors.repeatPassword }}</p>
        </div>

        <button 
          type="submit"
          class="w-full px-6 py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-500/30"
        >
          Registrieren
        </button>

        <ErrorDisplayComponent :message="errors.general" />
      </form>

      <p class="mt-6 text-sm">
        Schon ein Konto?
        <RouterLink to="/login" class="text-emerald-500 hover:text-emerald-600 font-medium transition-colors">Login</RouterLink>
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import * as yup from "yup";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { apiClient } from "@/config/api";
import ErrorDisplayComponent from "@/components/ErrorDisplayComponent.vue";

const router = useRouter();
const auth = useAuthStore();

const name = ref("");
const email = ref("");
const password = ref("");
const repeatPassword = ref("");

const errors = ref({});
const submitting = ref(false);

const schema = yup.object({
  name: yup.string().min(2, "Username is too short.").required("Username is required."),
  email: yup.string().email("Invalid email.").required("Email is required."),
  password: yup
    .string()
    .min(12, "Password must be at least 12 characters.")
    .matches(/[a-z]/, "Password must contain a lowercase letter.")
    .matches(/[A-Z]/, "Password must contain an uppercase letter.")
    .matches(/[0-9]/, "Password must contain a number.")
    .matches(/[^A-Za-z0-9]/, "Password must contain a symbol.")
    .required("Password is required."),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match.")
    .required("Repeat password is required."),
});

async function register() {
  errors.value = {};
  submitting.value = true;

  try {
    const formData = {
      name: name.value,
      email: email.value,
      password: password.value,
      repeatPassword: repeatPassword.value,
    };

    await schema.validate(formData, { abortEarly: false });

    const response = await apiClient.post('/users', {
      username: name.value,
      email: email.value,
      password: password.value,
    });

    if (response.data && response.data.id) {
      await auth.login({
        emailOrUsername: email.value,
        password: password.value,
      });
      router.push("/");
    }
  } catch (err) {
    if (err?.inner?.length) {
      const mapped = {};
      err.inner.forEach((e) => {
        if (!mapped[e.path]) mapped[e.path] = e.message;
      });
      errors.value = mapped;
    } 
    else if (err.response) {
      const message = err.response.data?.message || "Registration failed. Please try again.";
      errors.value = { general: message };
    } else if (err.request) {
      errors.value = { general: "Cannot connect to server. Please check if the backend is running." };
    } else {
      errors.value = { general: err.message || "Registration failed." };
    }
  } finally {
    submitting.value = false;
  }
}
</script>

