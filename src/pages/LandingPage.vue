<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">

    <PromoBanner />

    <div class="px-4 md:px-10 py-8">

      <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Your Accounts
      </h2>

      <!-- ACCOUNT CARDS -->
      <div class="space-y-6">
        <AccountCard
          v-for="account in accounts"
          :key="account.id"

          :account-id="account.id"
          :account-name="account.name"
          :account-number="maskNumber(account.accountNumber)"
          :holder-name="userFullName"
          :available="formatMoney(account.balance)"
          latest="--"
          icon="bank"

          :show-transfer-button="true"
          :show-pay-button="true"

          @transfer="goToTransfer(account.id)"
          @pay="goToPay(account.id)"

          class="hover:opacity-95 transition"
        />
      </div>

      <!-- Errors -->
      <p v-if="error" class="text-red-600 mt-4">
        {{ error }}
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { api } from "@/services/api";

import PromoBanner from "@/components/PromoBanner.vue";
import AccountCard from "@/components/AccountCard.vue";

const router = useRouter();

const accounts = ref([]);
const error = ref(null);

/* -----------------------------------
   USER FULL NAME (Holder Name)
----------------------------------- */
const firstName = sessionStorage.getItem("firstName") || "";
const lastName = sessionStorage.getItem("lastName") || "";
const email = sessionStorage.getItem("userEmail") || "";

let fullName = `${firstName} ${lastName}`.trim();
if (!fullName) fullName = email.split("@")[0];

const userFullName = fullName;

/* ---------- Helpers ---------- */
const maskNumber = (num) =>
  num ? "**** " + num.slice(-4) : "****";

const formatMoney = (amount) => `R ${Number(amount).toFixed(2)}`;

/* ---------- Navigate to Transfer Page ---------- */
const goToTransfer = (accountId) => {
  router.push({
    path: "/transfer",
    query: {
      fromAccountId: accountId,
    },
  });
};

/* ---------- Navigate to Pay Page ---------- */
const goToPay = (accountId) => {
  router.push({
    path: "/pay",
    query: {
      fromAccountId: accountId,
    },
  });
};

/* ---------- Load Accounts ---------- */
const loadDashboard = async () => {
  try {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      error.value = "Session expired. Please log in again.";
      return;
    }

    const result = await api.GetAccountByUserIdAsync(userId);
    accounts.value = Array.isArray(result) ? result : [];
  } catch (err) {
    error.value = err.message || "Failed to load dashboard data";
  }
};

onMounted(loadDashboard);
</script>
