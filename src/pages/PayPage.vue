<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">

      <!-- PAGE TITLE -->
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        Make a Payment
      </h2>

      <!-- SUCCESS BANNER -->
      <div
        v-if="message"
        class="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded flex justify-between"
      >
        <span>{{ message }}</span>
        <button @click="message = ''" class="font-bold">×</button>
      </div>

      <!-- ERROR BANNER -->
      <div
        v-if="errorMessage"
        class="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded flex justify-between"
      >
        <span>{{ errorMessage }}</span>
        <button @click="errorMessage = ''" class="font-bold">×</button>
      </div>

      <!-- ACCOUNT DROPDOWN -->
      <div class="relative mb-6" v-if="accounts.length > 0">
        <div
          class="w-full p-4 bg-white dark:bg-gray-700 rounded-md shadow border cursor-pointer flex items-center justify-between"
          @click="toggleDropdown"
        >
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full">
              💳
            </div>
            <div>
              <p class="font-semibold text-gray-700 dark:text-gray-200">
                {{ selectedAccount?.name || "Select an account" }}
              </p>
              <p class="text-xs text-gray-500">{{ selectedAccount?.accountNumber }}</p>
              <p class="text-xs text-gray-500">{{ userFullName }}</p>
            </div>
          </div>

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

        <!-- DROPDOWN LIST -->
        <div
          v-if="showAccDropdown"
          class="absolute z-50 mt-1 w-full bg-white dark:bg-gray-700 border rounded-md shadow"
        >
          <div
            v-for="acc in accounts"
            :key="acc.id"
            @click="selectAccount(acc)"
            class="p-4 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center justify-between"
          >
            <div>
              <p class="font-medium">{{ acc.name }}</p>
              <p class="text-xs text-gray-500">{{ acc.accountNumber }}</p>
            </div>
            <p class="text-xs font-semibold">R {{ Number(acc.balance).toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <!-- BENEFICIARY NAME -->
      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">Beneficiary Name</label>
        <input
          v-model="beneficiaryName"
          type="text"
          class="form-input w-full"
          placeholder="e.g. John Mthethwa"
        />
      </div>

      <!-- BANK -->
      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">Bank</label>
        <select v-model="beneficiaryBank" class="form-input w-full">
          <option disabled value="">Select bank</option>
          <option>Standard Bank</option>
          <option>FNB</option>
          <option>ABSA</option>
          <option>Nedbank</option>
          <option>Capitec</option>
        </select>
      </div>

      <!-- BRANCH -->
      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">Branch</label>
        <input
          v-model="branchName"
          type="text"
          class="form-input w-full"
          placeholder="e.g. Durban Central"
        />
      </div>

      <!-- BENEFICIARY ACCOUNT NUMBER -->
      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">Beneficiary Account Number</label>
        <input
          v-model="beneficiaryAccount"
          type="text"
          class="form-input w-full"
          placeholder="e.g. 1234567890"
        />
      </div>

      <!-- REFERENCE (YOUR) -->
      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">Your Reference</label>
        <input
          v-model="yourReference"
          type="text"
          class="form-input w-full"
          placeholder="Appears on your statement"
        />
      </div>

      <!-- THEIR REFERENCE -->
      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">Beneficiary Reference</label>
        <input
          v-model="theirReference"
          type="text"
          class="form-input w-full"
          placeholder="Appears on their statement"
        />
      </div>

      <!-- AMOUNT -->
      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">Amount</label>
        <div class="flex items-center space-x-2">
          <span class="font-bold">R</span>
          <input
            v-model.number="amount"
            type="number"
            min="1"
            class="form-input w-40"
            placeholder="0.00"
          />
        </div>
      </div>

      <!-- BUTTONS -->
      <div class="flex justify-end space-x-4 mt-6">
        <router-link
          to="/home"
          class="px-6 py-2 text-sm font-medium text-gray-600 dark:text-gray-300"
        >
          BACK
        </router-link>

        <button
          @click="submitPayment"
          class="px-8 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700"
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

// CORE DATA
const accounts = ref([]);
const selectedAccount = ref(null);
const fromAccountId = ref("");
const userFullName = ref(sessionStorage.getItem("userEmail") || "");

// PAYMENT DATA (fake UI fields)
const beneficiaryName = ref("");
const beneficiaryBank = ref("");
const branchName = ref("");
const beneficiaryAccount = ref("");
const yourReference = ref("");
const theirReference = ref("");

const amount = ref(null);
const description = ref(""); // this still maps to backend

const message = ref("");
const errorMessage = ref("");

const showAccDropdown = ref(false);

// LOAD ACCOUNTS
onMounted(async () => {
  const userId = sessionStorage.getItem("userId");
  const res = await api.GetAccountByUserIdAsync(userId);
  accounts.value = Array.isArray(res) ? res : [];
});

// DROPDOWN
function toggleDropdown() {
  showAccDropdown.value = !showAccDropdown.value;
}

function selectAccount(acc) {
  selectedAccount.value = acc;
  fromAccountId.value = acc.id;
  showAccDropdown.value = false;
}

// SUBMIT
async function submitPayment() {
  if (!fromAccountId.value || !amount.value) {
    errorMessage.value = "Please fill in required fields";
    return;
  }

  // Send only necessary fields to backend
  const payload = {
    fromAccountId: fromAccountId.value,
    amount: amount.value,
    description: beneficiaryName.value || description.value || "Payment"
  };

  const response = await api.pay(payload);

  if (!response?.success) {
    errorMessage.value = response?.message || "Payment failed.";
    return;
  }

  router.push({
    name: "PaymentSuccess",
    query: {
      txn: response.transactionId,
      amount: amount.value,
      acc: selectedAccount.value.accountNumber,
      name: beneficiaryName.value,
    },
  });
}
</script>

<style scoped>
.form-input {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: white;
}
</style>
