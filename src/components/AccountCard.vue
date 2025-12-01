<template>
  <div
    class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between"
  >
    <!-- LEFT -->
    <div class="flex items-start space-x-4 w-full md:w-1/2">
      <div
        class="w-12 h-12 flex items-center justify-center rounded-full"
        :class="icon === 'bank' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'"
      >
        <!-- Bank Icon -->
        <svg
          v-if="icon === 'bank'"
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 10l9-7 9 7v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10z"
          />
        </svg>

        <!-- Menu Icon -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2 7h20M2 12h20M2 17h20"
          />
        </svg>
      </div>

      <div>
        <p class="font-bold text-gray-700 dark:text-gray-200">{{ accountName }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ accountNumber }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Holder: {{ holderName }}</p>
      </div>
    </div>

    <!-- RIGHT -->
    <div class="mt-4 md:mt-0 w-full md:w-1/2 flex flex-col space-y-1">
      <p class="text-gray-500 text-sm">Available balance</p>
      <p class="font-bold text-gray-700 dark:text-gray-200">{{ available }}</p>

      <p class="text-gray-500 text-sm mt-2">Latest balance</p>
      <p class="font-bold text-gray-700 dark:text-gray-200">{{ latest }}</p>

      <div class="flex space-x-4 mt-4">

        <!-- PAY BUTTON -->
        <button
          v-if="showPayButton"
          @click.stop="emitPay"
          class="text-purple-600 font-semibold hover:underline"
        >
          Pay
        </button>

        <!-- TRANSFER BUTTON -->
        <button
          v-if="showTransferButton"
          @click.stop="emitTransfer"
          class="text-purple-600 font-semibold hover:underline"
        >
          Transfer
        </button>

        <!-- MANAGE BUTTON -->
        <button
          v-if="showManageButton"
          @click.stop="emitManage"
          class="text-purple-600 font-semibold hover:underline"
        >
          Manage
        </button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  accountId: String,           // <= IMPORTANT for Pay / Transfer
  accountName: String,
  accountNumber: String,
  holderName: String,
  available: String,
  latest: String,
  icon: String,

  // Buttons visibility
  showTransferButton: { type: Boolean, default: false },
  showPayButton: { type: Boolean, default: false },
  showManageButton: { type: Boolean, default: false }
});

const emit = defineEmits(["transfer", "pay", "manage"]);

const emitTransfer = () => emit("transfer", props.accountId);
const emitPay = () => emit("pay", props.accountId);
const emitManage = () => emit("manage", props.accountId);
</script>
