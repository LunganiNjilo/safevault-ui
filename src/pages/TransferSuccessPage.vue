<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex justify-center items-center">

    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 max-w-lg w-full text-center">

      <div class="text-green-500 text-6xl mb-4">✔</div>

      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Transfer Successful
      </h2>

      <p class="text-gray-600 dark:text-gray-300 mb-6">
        You transferred <strong>R {{ amount }}</strong> from  
        <strong>{{ fromMasked }}</strong>  
        to  
        <strong>{{ toMasked }}</strong>.
      </p>

      <button
        class="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        @click="goHome"
      >
        Back to Accounts
      </button>

    </div>

  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";

const router = useRouter();

// Read values from router state
const from = sessionStorage.getItem("transfer_from")
const to = sessionStorage.getItem("transfer_to")
const amount = sessionStorage.getItem("transfer_amount")


// Masking
const mask = (num) => "**** " + num.slice(-4);

const fromMasked = mask(from);
const toMasked = mask(to);

const goHome = () => {
  router.push("/home");
};
</script>
