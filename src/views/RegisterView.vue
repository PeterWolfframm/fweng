<template>
  <div class="p-8 text-center">
    <h1 class="text-2xl font-bold mb-8">Registrieren</h1>

    <form @submit.prevent="register">
    <p v-if="errors.general" class="text-error text-sm mb-2">{{ errors.general }}</p>

    <!-- Salutation -->
    <div class="mb-4">
      <select v-model="salutation" class="select select-bordered w-full max-w-xs">
        <option disabled value="">Select salutation</option>
        <option value="male">male</option>
        <option value="female">female</option>
        <option value="other">other</option>
      </select>
      <p v-if="errors.salutation" class="text-error text-sm mt-1">{{ errors.salutation }}</p>
    </div>

    <div v-if="salutation === 'other'" class="mb-4">
      <input
        v-model="salutationOther"
        type="text"
        placeholder="Please specify (max 30 chars)"
        class="input input-bordered w-full max-w-xs"
      />
      <p v-if="errors.salutationOther" class="text-error text-sm mt-1">{{ errors.salutationOther }}</p>
    </div>

      <!-- Name -->
      <div class="mb-4">
        <input
          v-model="name"
          type="text"
          placeholder="Name"
          class="input input-bordered w-full max-w-xs"
        />
      </div>
      <p v-if="errors.name" class="text-error text-sm mt-1">{{ errors.name }}</p>


      <!-- Email -->
      <div class="mb-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="input input-bordered w-full max-w-xs"
        />
      </div>
      <p v-if="errors.email" class="text-error text-sm mt-1">{{ errors.email }}</p>

      <!-- Country -->
      <div class="mb-4">
        <select v-model="country" class="select select-bordered w-full max-w-xs">
          <option disabled value="">Select country</option>
          <option v-for="c in countryOptions" :key="c" :value="c">{{ c }}</option>
        </select>
        <p v-if="errors.country" class="text-error text-sm mt-1">{{ errors.country }}</p>
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
      <p v-if="errors.password" class="text-error text-sm mt-1">{{ errors.password }}</p>

      <!-- Repeat Password -->
      <div class="mb-4">
        <input
          v-model="repeatPassword"
          type="password"
          placeholder="Repeat Password"
          class="input input-bordered w-full max-w-xs"
        />
        <p v-if="errors.repeatPassword" class="text-error text-sm mt-1">{{ errors.repeatPassword }}</p>
      </div>

      <!--Admin-->
      <div class="mb-4">
        <input v-model="adminCode" type="password" placeholder="Admin Code" class="input input-bordered w-full max-w-xs"/>
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
import { ref } from "vue";
import * as yup from "yup";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { countryOptions } from "@/constants/countries";

const router = useRouter();
const auth = useAuthStore();

// vorhandene Felder
const name = ref("");
const email = ref("");
const password = ref("");

// neue Felder
const adminCode = ref("");
const salutation = ref("");
const salutationOther = ref("");
const country = ref("");
const repeatPassword = ref("");

const errors = ref({});
const submitting = ref(false);

const schema = yup.object({
  salutation: yup.string().oneOf(["male", "female", "other"]).required("Salutation is required."),
  salutationOther: yup.string().max(30, "Max 30 characters.").when("salutation", {
    is: "other",
    then: (s) => s.required("Please specify your salutation."),
    otherwise: (s) => s.optional(),
  }),
  name: yup.string().min(2, "Username is too short.").required("Username is required."),
  email: yup.string().email("Invalid email.").required("Email is required."),
  country: yup.string().required("Country is required."),
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
      salutation: salutation.value,
      salutationOther: salutationOther.value,
      name: name.value,
      email: email.value,
      country: country.value,
      password: password.value,
      repeatPassword: repeatPassword.value,
    };

    await schema.validate(formData, { abortEarly: false });

    const ADMIN_SECRET = "SECRET123"
    const role = adminCode.value === ADMIN_SECRET ? "ADMIN" : "USER"

    auth.register({
      salutation: salutation.value,
      salutationOther: salutationOther.value,
      username: name.value,
      email: email.value,
      country: country.value,
      password: password.value,
      role,
    });

    router.push("/");
  } catch (err) {
    if (err?.inner?.length) {
      const mapped = {};
      err.inner.forEach((e) => {
        if (!mapped[e.path]) mapped[e.path] = e.message;
      });
      errors.value = mapped;
    } else {
      errors.value = { general: err.message || "Registration failed." };
    }
  } finally {
    submitting.value = false;
  }
}
</script>

