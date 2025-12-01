<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
    <div class="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      
      <div class="flex flex-col md:flex-row">

        <!-- LEFT IMAGE -->
        <div class="md:w-1/2 hidden md:block">
          <img
            :src="createAccountImage"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- FORM -->
        <div class="w-full md:w-1/2 p-8">
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Create Account
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">First Name</label>
              <input v-model="firstName" type="text" class="form-input" />
            </div>

            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Last Name</label>
              <input v-model="lastName" type="text" class="form-input" />
            </div>

            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">ID Number</label>
              <input v-model="idNumber" type="text" maxlength="13" class="form-input" />
            </div>

            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Date of Birth</label>
              <input v-model="dateOfBirth" type="date" class="form-input" />
            </div>

          </div>

          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm mb-1">Email</label>
              <input v-model="email" type="email" class="form-input" />
            </div>

            <div>
              <label class="block text-sm mb-1">Password</label>
              <input v-model="password" type="password" class="form-input" />
            </div>

            <div>
              <label class="block text-sm mb-1">Confirm Password</label>
              <input v-model="confirmPassword" type="password" class="form-input" />
            </div>
          </div>

          <div class="flex items-center mb-4">
            <input type="checkbox" v-model="agreed" class="mr-2" />
            <span class="text-sm">I agree to the privacy policy</span>
          </div>

          <p v-if="errorMessage" class="text-red-600 text-sm mb-3">
            {{ errorMessage }}
          </p>

          <button
            class="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50"
            :disabled="!canSubmit || isLoading"
            @click="handleCreateAccount"
          >
            {{ isLoading ? "Creating..." : "Create Account" }}
          </button>

          <p class="mt-4 text-center text-sm">
            Already have an account?
            <RouterLink to="/login" class="text-purple-600 font-medium">
              Login
            </RouterLink>
          </p>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { api } from "@/services/api"
import createAccountImage from "@/assets/img/create-account-office.jpeg"

const router = useRouter()

const firstName = ref("")
const lastName = ref("")
const idNumber = ref("")
const dateOfBirth = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const agreed = ref(false)
const errorMessage = ref("")
const isLoading = ref(false)

const canSubmit = computed(() =>
  firstName.value &&
  lastName.value &&
  idNumber.value &&
  dateOfBirth.value &&
  email.value &&
  password.value &&
  confirmPassword.value &&
  password.value === confirmPassword.value &&
  agreed.value
)

const handleCreateAccount = async () => {
  errorMessage.value = ""
  isLoading.value = true

  try {
    await api.register({
      firstName: firstName.value,
      lastName: lastName.value,
      idNumber: idNumber.value,
      dateOfBirth: dateOfBirth.value,
      email: email.value,
      password: password.value
    })

    router.push("/login")
  } catch (error) {
    errorMessage.value =
      error.message || "Registration failed. Please try again."
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.form-input {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  font-size: 14px;
}

.form-input:focus {
  outline: none;
  border-color: #7c3aed;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.3);
}
</style>
