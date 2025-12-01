<template>
  <div class="container mx-auto px-6 py-8">

    <!-- PAGE TITLE -->
    <h1 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
      Buy Airtime
    </h1>

    <!-- ACCOUNT SELECTOR -->
    <div class="relative mb-6" v-if="accounts.length > 0">
      <div
        class="w-full p-4 bg-white dark:bg-gray-800 rounded-md shadow border border-gray-300 dark:border-gray-700 flex items-center justify-between cursor-pointer"
        @click="showAccDropdown = !showAccDropdown"
      >
        <div class="flex items-center space-x-3">
          <div class="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full">
            💳
          </div>

          <div>
            <p class="font-semibold text-gray-700 dark:text-gray-200">
              {{ selectedAccount?.name }}
            </p>
            <p class="text-xs text-gray-500">
              {{ selectedAccount?.accountNumber }}
            </p>
            <p class="text-xs text-gray-500">
              {{ userFullName }}
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <div class="text-right pr-4 border-r">
            <p class="text-xs text-gray-500">Available balance</p>
            <p class="font-semibold text-gray-700 dark:text-gray-200">
              R {{ fmtBal(selectedAccount) }}
            </p>
          </div>

          <svg
            :class="showAccDropdown ? 'rotate-180' : ''"
            class="w-5 h-5 text-gray-600 transition-transform"
            fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <!-- DROPDOWN MENU -->
      <div
        v-if="showAccDropdown"
        class="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow"
      >
        <div
          v-for="acc in accounts"
          :key="acc.accountNumber"
          @click="selectAccount(acc)"
          class="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between"
        >
          <div>
            <p class="font-medium">{{ acc.name }}</p>
            <p class="text-xs text-gray-500">{{ acc.accountNumber }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-500">R {{ acc.balance.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- FORM SECTION -->
    <div class="w-full p-6 bg-white dark:bg-gray-800 rounded-md shadow border border-gray-300 dark:border-gray-700">

      <!-- NETWORK -->
      <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Select your network operator
      </h2>

      <div class="flex items-center space-x-6">
        <div
          v-for="op in operators"
          :key="op.name"
          @click="selectedOperator = op.name"
          class="cursor-pointer flex flex-col items-center p-4 border rounded-md w-24 hover:bg-gray-50"
          :class="selectedOperator === op.name ? 'border-blue-500 bg-blue-50 dark:bg-gray-900' : 'border-gray-300'"
        >
          <img :src="op.logo" class="w-10 h-10 mb-2" />
          <p class="text-xs font-semibold">{{ op.name }}</p>
        </div>
      </div>

      <!-- RED VALIDATION LABEL -->
      <p v-if="errorOperator" class="text-red-600 text-xs mt-1">
        {{ errorOperator }}
      </p>

      <!-- CELLPHONE -->
      <div class="mt-6">
        <p class="text-sm text-gray-600">Cellphone number</p>
        <input
          v-model="cell"
          class="mt-2 w-96 px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
          placeholder="082 123 4567"
        />

        <p v-if="errorCell" class="text-red-600 text-xs mt-1">
          {{ errorCell }}
        </p>
      </div>

      <!-- AMOUNT -->
      <div class="mt-6">
        <p class="text-sm text-gray-600">Amount</p>
        <input
          v-model.number="amount"
          type="number"
          min="1"
          class="mt-2 w-40 px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
          placeholder="10"
        />

        <p v-if="errorAmount" class="text-red-600 text-xs mt-1">
          {{ errorAmount }}
        </p>
      </div>

      <!-- DATE -->
      <div class="mt-6">
        <p class="text-sm text-gray-600">Purchase date</p>
        <input
          type="date"
          v-model="purchaseDate"
          class="mt-2 px-3 py-2 border rounded-md"
        />
      </div>

      <!-- BUTTONS -->
      <div class="mt-8 flex justify-end space-x-4">
        <router-link to="/home" class="text-blue-700 text-sm font-medium px-6 py-2">
          BACK
        </router-link>

        <button
          @click="completePurchase"
          class="text-sm bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700"
        >
          Pay
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { api } from "@/services/api";

const router = useRouter();

// Backend Data
const accounts = ref([]);
const selectedAccount = ref(null);
const userFullName = ref("");
const loading = ref(true);

// Dropdown state
const showAccDropdown = ref(false);

// Error states
const errorOperator = ref("");
const errorCell = ref("");
const errorAmount = ref("");

// Account select
function selectAccount(acc) {
  selectedAccount.value = acc;
  showAccDropdown.value = false;
}

// Format balance
function fmtBal(acc) {
  if (!acc || acc.balance == null) return "0.00";
  const n = Number(acc.balance);
  return isNaN(n) ? "0.00" : n.toFixed(2);
}

// Form data
const selectedOperator = ref(null);
const cell = ref("");
const amount = ref(null);
const purchaseDate = ref(new Date().toISOString().substr(0, 10));

// Operators...
const operators = [
  { name: "Vodacom", logo: new URL('@/assets/img/icons/vodacom.png', import.meta.url).href },
  { name: "MTN", logo: new URL('@/assets/img/icons/mtn.png', import.meta.url).href },
  { name: "CellC", logo: new URL('@/assets/img/icons/cellc.png', import.meta.url).href },
  { name: "Telkom Mobile", logo: new URL('@/assets/img/icons/telkom.jpg', import.meta.url).href },
  { name: "Standard Bank", logo: new URL('@/assets/img/icons/standardbank.jpg', import.meta.url).href },
];

// Load accounts
onMounted(async () => {
  try {
    const userId = sessionStorage.getItem("userId");
    const email = sessionStorage.getItem("userEmail");

    if (!userId) return;

    const acc = await api.GetAccountByUserIdAsync(userId);

    if (acc && acc.length > 0) {
      accounts.value = acc;
      selectedAccount.value = acc[0];
      userFullName.value = email;
    }

  } catch (err) {
    console.error("Failed to load account", err);
  } finally {
    loading.value = false;
  }
});

// Purchase
async function completePurchase() {
  // reset validation
  errorOperator.value = "";
  errorCell.value = "";
  errorAmount.value = "";

  let hasError = false;

  if (!selectedOperator.value) {
    errorOperator.value = "Please select your network operator.";
    hasError = true;
  }

  if (!cell.value) {
    errorCell.value = "Please enter a cellphone number.";
    hasError = true;
  }

  if (!amount.value) {
    errorAmount.value = "Please enter an amount.";
    hasError = true;
  }

  if (hasError) return;

  const description =
    `Airtime purchase (${selectedOperator.value}) to ${cell.value}`;

  try {
    const response = await api.purchaseAirtime({
      accountNumber: selectedAccount.value.accountNumber,
      amount: amount.value,
      description: description
    });

    if (!response?.isSuccess) {
      alert(response?.message || "Airtime purchase failed");
      return;
    }

    router.push({
      name: "AirtimeSuccess",
      query: {
        operator: selectedOperator.value,
        cell: cell.value,
        amount: amount.value,
        date: purchaseDate.value,
        fromAcc: selectedAccount.value.accountNumber,
        newBalance: response.newBalance
      }
    });

  } catch (e) {
    console.error(e);
    alert("Failed to complete purchase");
  }
}
</script>
