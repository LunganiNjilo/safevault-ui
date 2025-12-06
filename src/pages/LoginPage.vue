<template>
  <div class="relative flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">

    <!-- Login Card -->
    <div
      class="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800"
    >
      <div class="flex flex-col overflow-y-auto md:flex-row">

        <!-- Left Image -->
        <div class="h-32 md:h-auto md:w-1/2">
          <img
            aria-hidden="true"
            class="object-cover w-full h-full dark:hidden"
            :src="loginImage"
            alt="Login"
          />
          <img
            aria-hidden="true"
            class="hidden object-cover w-full h-full dark:block"
            :src="loginImageDark"
            alt="Login Dark"
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
                autocomplete="username"
                class="block w-full mt-1 text-sm form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 
                      focus:border-purple-400 focus:outline-none focus:shadow-outline-purple"
                placeholder="Enter your email"
              />
            </label>

            <!-- Password -->
            <label class="block mt-4 text-sm">
              <span class="text-gray-700 dark:text-gray-400">Password</span>
              <input
                v-model="password"
                type="password"
                autocomplete="current-password"
                class="block w-full mt-1 text-sm form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300
                      focus:border-purple-400 focus:outline-none focus:shadow-outline-purple"
                placeholder="Enter your password"
              />
            </label>

            <!-- Error Message -->
            <p v-if="errorMessage" class="mt-3 text-sm text-red-600">
              {{ errorMessage }}
            </p>

            <!-- Login Button -->
            <button
              :disabled="isLoading"
              @click="handleLogin"
              class="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center
                     text-white transition-colors duration-150 bg-purple-600 border border-transparent
                     rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none
                     focus:shadow-outline-purple disabled:opacity-50"
            >
              <span v-if="!isLoading">Log In</span>
              <span v-else>Logging in...</span>
            </button>

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

// Pre-filled values for testing
const email = ref("test@local.com")
const password = ref("P@ssw0rd!")
const errorMessage = ref("")
const isLoading = ref(false)

const handleLogin = async () => {
  errorMessage.value = ""
  isLoading.value = true

  if (!email.value || !password.value) {
    errorMessage.value = "Please enter both email and password."
    isLoading.value = false
    return
  }

  try {
    const response = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: email.value.trim(),
        password: password.value
      })
    })

    if (!response?.userId) {
      throw new Error("Invalid email or password. Please try again.")
    }

    sessionStorage.setItem("userId", response.userId)
    sessionStorage.setItem("userEmail", response.email)
    sessionStorage.setItem("firstName", response.firstName)
    sessionStorage.setItem("lastName", response.lastName)

    // Let Navbar update itself
    window.dispatchEvent(new Event("profile-updated"))

    router.push("/home")

  } catch (error) {
    console.error("Login failed:", error)

    if (!navigator.onLine) {
      errorMessage.value = "You appear to be offline. Check your connection."
    } else if (error?.message?.includes("Failed to fetch")) {
      errorMessage.value = "Unable to reach the server. Try again shortly."
    } else {
      errorMessage.value = error.message || "Something went wrong. Try again."
    }
  } finally {
    isLoading.value = false
  }
}
</script>
