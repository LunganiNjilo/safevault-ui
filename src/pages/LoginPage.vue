<template>
  <div class="relative flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">

    <!-- Actual Login Card -->
    <div
      class="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800"
    >
      <div class="flex flex-col overflow-y-auto md:flex-row">

        <!-- Left Image Panel -->
        <div class="h-32 md:h-auto md:w-1/2">
          <img
            aria-hidden="true"
            class="object-cover w-full h-full dark:hidden"
            :src="loginImage"
            alt="Office"
          />
          <img
            aria-hidden="true"
            class="hidden object-cover w-full h-full dark:block"
            :src="loginImageDark"
            alt="Office"
          />
        </div>

        <!-- Form Section -->
        <div class="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
          <div class="w-full">

            <h1 class="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
              Login
            </h1>

            <!-- Email -->
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Email</span>
              <input
                v-model="email"
                type="email"
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700
                       focus:border-purple-400 focus:outline-none focus:shadow-outline-purple
                       dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="Jane Doe"
              />
            </label>

            <!-- Password -->
            <label class="block mt-4 text-sm">
              <span class="text-gray-700 dark:text-gray-400">Password</span>
              <input
                v-model="password"
                type="password"
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700
                       focus:border-purple-400 focus:outline-none focus:shadow-outline-purple
                       dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="***************"
              />
            </label>

            <!-- Login Button -->
            <button
              class="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center
                     text-white transition-colors duration-150 bg-purple-600 border border-transparent
                     rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none
                     focus:shadow-outline-purple"
              @click="handleLogin"
            >
              Log in
            </button>

            <p v-if="errorMessage" class="mt-3 text-sm text-red-600">
              {{ errorMessage }}
            </p>

            <hr class="my-8" />

            <!-- Removed Forgot Password + Create Account -->

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { apiFetch } from "@/services/api"

import loginImage from "@/assets/img/SafeVault.png"
import loginImageDark from "@/assets/img/login-office-dark.jpeg"

const router = useRouter()

const email = ref("")
const password = ref("")
const errorMessage = ref("")
const isLoading = ref(false)

const handleLogin = async () => {
  errorMessage.value = ""
  isLoading.value = true

  try {
    const response = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    console.log("Login successful:", response)

    if (response?.userId) {
      // Store all user info returned by the API
      sessionStorage.setItem("userId", response.userId)
      sessionStorage.setItem("userEmail", response.email)
      sessionStorage.setItem("firstName", response.firstName)
      sessionStorage.setItem("lastName", response.lastName)
    } else {
      throw new Error("User identity not returned from API")
    }

    router.push("/home")
  } catch (error) {
    console.error("Login failed:", error)
    errorMessage.value = error.message || "Invalid login credentials."
  } finally {
    isLoading.value = false
  }
}
</script>
