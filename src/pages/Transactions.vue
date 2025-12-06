<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-4xl mx-auto">

      <!-- ACCOUNT SELECTOR -->
      <div class="relative mb-6" v-if="accounts.length > 0">

        <!-- ACCOUNT CARD WITH DROPDOWN ARROW -->
        <div
          class="w-full p-4 bg-white dark:bg-gray-800 rounded-md shadow border cursor-pointer flex items-center justify-between"
          @click="showAccDropdown = !showAccDropdown"
        >

          <!-- LEFT SECTION: ICON + TEXT -->
          <div class="flex items-center space-x-3">
            <div class="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full">
              💳
            </div>

            <div>
              <p class="font-semibold">{{ selectedAccount?.name }}</p>
              <p class="text-xs text-gray-500">{{ selectedAccount?.accountNumber }}</p>
              <p class="text-xs text-gray-500">{{ userFullName }}</p>
            </div>
          </div>

          <!-- RIGHT: DROPDOWN ICON -->
          <svg
            :class="showAccDropdown ? 'rotate-180' : ''"
            class="w-5 h-5 text-gray-600 transition-transform"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>

        </div>

        <!-- DROPDOWN MENU -->
        <div
          v-if="showAccDropdown"
          class="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border rounded-md shadow"
        >
          <div
            v-for="acc in accounts"
            :key="acc.id"
            @click="selectAccount(acc)"
            class="p-3 hover:bg-gray-100 cursor-pointer"
          >
            <p class="font-medium">{{ acc.name }}</p>
            <p class="text-xs text-gray-500">{{ acc.accountNumber }}</p>
          </div>
        </div>
      </div>

      <!-- RAW TRANSACTION LOG -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <table class="min-w-full text-sm">
          <thead class="border-b">
            <tr>
              <th class="py-2 px-3 text-left">Date</th>
              <th class="py-2 px-3 text-left">Description</th>
              <th class="py-2 px-3 text-left">Type</th>
              <th class="py-2 px-3 text-left">Amount</th>
              <th class="py-2 px-3 text-left">Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in transactions" :key="t.id" class="border-b">
              <td class="py-2 px-3">{{ formatDate(t.createdAt) }}</td>
              <td class="py-2 px-3">{{ t.description }}</td>
              <td class="py-2 px-3">{{ t.type }}</td>
              <td class="py-2 px-3">R {{ Number(t.amount).toFixed(2) }}</td>
              <td class="py-2 px-3">R {{ Number(t.balanceAfter).toFixed(2) }}</td>
            </tr>

            <tr v-if="transactions.length === 0">
              <td colspan="5" class="text-center py-4 text-gray-500">No transactions found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ERROR -->
      <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "@/services/api";

const accounts = ref([]);
const selectedAccount = ref(null);
const userFullName = ref("");
const showAccDropdown = ref(false);
const transactions = ref([]);
const error = ref("");

function formatDate(iso) {
  return iso ? iso.split(".")[0].replace("T", " ") : "-";
}

onMounted(async () => {
  const userId = sessionStorage.getItem("userId");
  userFullName.value = sessionStorage.getItem("userEmail") || "";

  const acc = await api.GetAccountByUserIdAsync(userId);
  accounts.value = Array.isArray(acc) ? acc : [];

  if (accounts.value.length > 0) {
    selectedAccount.value = accounts.value[0];
    loadTransactions();
  }
});

async function loadTransactions() {
  try {
    const accId = selectedAccount.value.id;
    const res = await api.getTrasationsByAccount(accId);

    transactions.value = Array.isArray(res) ? res : [];
  } catch (e) {
    error.value = "Failed to load transactions";
  }
}

function selectAccount(acc) {
  selectedAccount.value = acc;
  showAccDropdown.value = false;
  loadTransactions();
}
</script>