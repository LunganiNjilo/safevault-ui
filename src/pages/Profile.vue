<template>
  <div class="container mx-auto px-6 py-8">
    <h1 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
      Profile
    </h1>

    <div class="w-full max-w-xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">

      <!-- SUCCESS BANNER -->
      <div
        v-if="message"
        class="mb-4 flex items-center justify-between p-3 bg-green-100 border border-green-300 text-green-700 rounded"
      >
        <span>{{ message }}</span>
        <button 
          class="text-green-700 font-bold"
          @click="message = ''"
        >
          ×
        </button>
      </div>

      <!-- ERROR BANNER -->
      <div
        v-if="errorMessage"
        class="mb-4 flex items-center justify-between p-3 bg-red-100 border border-red-300 text-red-700 rounded"
      >
        <span>{{ errorMessage }}</span>
        <button 
          class="text-red-700 font-bold"
          @click="errorMessage = ''"
        >
          ×
        </button>
      </div>

      <!-- First Name -->
      <label class="block text-sm mb-4">
        <span class="text-gray-700 dark:text-gray-400">First Name</span>
        <input
          v-model="firstName"
          type="text"
          class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700
                 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple
                 dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
          placeholder="Enter first name"
        />
      </label>

      <!-- Last Name -->
      <label class="block text-sm mb-4">
        <span class="text-gray-700 dark:text-gray-400">Last Name</span>
        <input
          v-model="lastName"
          type="text"
          class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700
                 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple
                 dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
          placeholder="Enter last name"
        />
      </label>

      <!-- Email -->
      <label class="block text-sm mb-4">
        <span class="text-gray-700 dark:text-gray-400">Email</span>
        <input
          v-model="email"
          type="email"
          class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700
                 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple
                 dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
          placeholder="Enter email"
        />
      </label>

      <!-- Password -->
      <label class="block text-sm mb-4">
        <span class="text-gray-700 dark:text-gray-400">Password</span>
        <input
          v-model="password"
          type="password"
          class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700
                 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple
                 dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
          placeholder="Enter new password"
        />
      </label>

      <!-- Save Button -->
      <button
        class="w-full px-4 py-2 mt-4 text-sm font-medium text-center text-white bg-purple-600
               rounded-lg hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
        @click="saveProfile"
      >
        Save Changes
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { apiFetch } from '@/services/api'

// Load initial values from sessionStorage
const userId = sessionStorage.getItem('userId') // <-- IMPORTANT

const firstName = ref(sessionStorage.getItem('firstName') || '')
const lastName  = ref(sessionStorage.getItem('lastName') || '')
const email     = ref(sessionStorage.getItem('userEmail') || '')
const password  = ref('') // never preload password

const message = ref('')
const errorMessage = ref('')

const saveProfile = async () => {
  message.value = ""
  errorMessage.value = ""

  if (!userId) {
    errorMessage.value = "Session expired. Please log in again."
    return;
  }

  try {
    const response = await apiFetch("/users/update-profile", {
      method: "PUT",
      body: JSON.stringify({
        userId: userId,          // <-- SEND USER ID TO BACKEND
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value
      })
    })

    if (!response || response.success !== true) {
      errorMessage.value = response?.message || "Failed to update profile."
      return
    }

    console.log("UPDATE PROFILE RESPONSE:", response)
    
    // Save updated details to session
    sessionStorage.setItem("firstName", firstName.value)
    sessionStorage.setItem("lastName", lastName.value)
    sessionStorage.setItem("userEmail", email.value)

    message.value = "Profile updated successfully."

    // Auto-hide after 3 seconds
    setTimeout(() => {
      message.value = ""
    }, 3000)

  } catch (err) {
    errorMessage.value = err.message || "Failed to update profile."
  }
}
</script>
