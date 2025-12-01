<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-6 py-10">

    <div class="bg-white dark:bg-gray-800 w-full max-w-xl shadow-lg rounded-lg p-8 text-center">

      <!-- SUCCESS ICON -->
      <div class="flex justify-center mb-6">
        <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <svg class="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <!-- TITLE -->
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Payment Successful
      </h2>

      <p class="text-gray-600 dark:text-gray-400 mb-6">
        The payment has been processed successfully.
      </p>

      <!-- DETAILS CARD -->
      <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 text-left space-y-3">

        <div>
          <p class="text-gray-500 text-sm">Amount Paid</p>
          <p class="text-lg font-semibold text-gray-800 dark:text-gray-200">
            R {{ amount }}
          </p>
        </div>

        <div>
          <p class="text-gray-500 text-sm">Paid To</p>
          <p class="text-gray-800 dark:text-gray-200 font-medium">
            {{ beneficiaryName }}
          </p>
        </div>

        <div>
          <p class="text-gray-500 text-sm">From Account</p>
          <p class="text-gray-800 dark:text-gray-200 font-medium">
            {{ fromAccount }}
          </p>
        </div>

        <div>
          <p class="text-gray-500 text-sm">Transaction ID</p>
          <p class="text-gray-800 dark:text-gray-200 font-mono text-sm">
            {{ transactionId }}
          </p>
        </div>

      </div>

      <!-- BUTTONS -->
      <div class="flex flex-col mt-8 space-y-4">

        <router-link
          to="/home"
          class="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition text-center"
        >
          Back to Home
        </router-link>

        <router-link
          to="/pay"
          class="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 dark:hover:bg-gray-700 transition text-center"
        >
          Make Another Payment
        </router-link>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()

/* Read URL query parameters */
const transactionId = route.query.txn || "N/A"
const amount = route.query.amount || "0.00"
const fromAccount = route.query.acc || "Unknown account"
const beneficiaryName = route.query.name || "Unknown beneficiary"
</script>

<style scoped>
</style>
