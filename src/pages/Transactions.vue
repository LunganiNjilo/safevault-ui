<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-4xl mx-auto">

      <!-- ACCOUNT SELECTOR -->
      <div class="relative mb-6" v-if="accounts.length > 0">
        <div
          class="w-full p-4 bg-white dark:bg-gray-800 rounded-md shadow border cursor-pointer flex items-center justify-between"
          @click="showAccDropdown = !showAccDropdown"
        >
          <div class="flex items-center space-x-3">
            <div class="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full">💳</div>
            <div>
              <p class="font-semibold">{{ selectedAccount?.name }}</p>
              <p class="text-xs text-gray-500">{{ selectedAccount?.accountNumber }}</p>
              <p class="text-xs text-gray-500">{{ userFullName }}</p>
            </div>
          </div>

          <svg
            :class="showAccDropdown ? 'rotate-180' : ''"
            class="w-5 h-5 text-gray-600 transition-transform"
            fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

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

      <!-- HEADER + ADD BUTTON -->
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Transactions</h2>
        <button
          v-if="selectedAccount"
          @click="openCreate"
          class="px-4 py-2 text-sm font-medium rounded-md bg-purple-600 text-white hover:bg-purple-700"
        >
          + Manual Transaction
        </button>
      </div>

      <!-- TRANSACTION TABLE -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <table class="min-w-full text-sm">
          <thead class="border-b">
            <tr>
              <th class="py-2 px-3 text-left">Date</th>
              <th class="py-2 px-3 text-left">Description</th>
              <th class="py-2 px-3 text-left">Type</th>
              <th class="py-2 px-3 text-left">Amount</th>
              <th class="py-2 px-3 text-left">Balance</th>
              <th class="py-2 px-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in transactions" :key="t.id" class="border-b">
              <td class="py-2 px-3">{{ formatDate(t.createdAt) }}</td>
              <td class="py-2 px-3">{{ t.description }}</td>

              <!-- SHOW TYPE EXACTLY AS BACKEND PROVIDES -->
              <td class="py-2 px-3">{{ t.type }}</td>

              <td class="py-2 px-3">R {{ Number(t.amount).toFixed(2) }}</td>
              <td class="py-2 px-3">R {{ Number(t.balanceAfter).toFixed(2) }}</td>

              <td class="py-2 px-3">
                <div class="flex items-center gap-2">
                  <button
                    v-if="t.isManual"
                    class="text-xs text-blue-600 hover:underline"
                    @click="openEdit(t)"
                  >
                    Edit
                  </button>
                  <button
                    v-if="t.isManual"
                    class="text-xs text-red-600 hover:underline"
                    @click="confirmDelete(t)"
                  >
                    Delete
                  </button>
                  <span v-if="!t.isManual" class="text-xs text-gray-400 italic">system</span>
                </div>
              </td>
            </tr>

            <tr v-if="transactions.length === 0">
              <td colspan="6" class="text-center py-4 text-gray-500">No transactions found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
    </div>

    <!-- MANUAL TRANSACTION MODAL -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {{ editing ? "Edit Manual Transaction" : "Add Manual Transaction" }}
        </h3>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium mb-1">Type</label>
            <select v-model="form.type"
              class="w-full border rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-100">
              <option value="Debit">Debit</option>
              <option value="Credit">Credit</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium mb-1">Amount</label>
            <input type="number" min="0.01" step="0.01"
              v-model.number="form.amount"
              class="w-full border rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label class="block text-xs font-medium mb-1">Description</label>
            <input type="text" v-model="form.description"
              class="w-full border rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label class="block text-xs font-medium mb-1">Transaction Date</label>
            <input type="date" v-model="form.transactionDate"
              class="w-full border rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <p v-if="formError" class="text-xs text-red-600">{{ formError }}</p>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button class="px-4 py-2 text-sm rounded-md border" @click="closeModal">Cancel</button>
          <button class="px-4 py-2 text-sm rounded-md bg-purple-600 text-white hover:bg-purple-700" @click="saveManual">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "@/services/api";

const accounts = ref([]);
const selectedAccount = ref(null);
const transactions = ref([]);
const showAccDropdown = ref(false);
const showModal = ref(false);
const editing = ref(null);
const formError = ref("");
const userFullName = ref("");
const error = ref("");

const form = ref({
  type: "Debit",
  amount: null,
  description: "",
  transactionDate: new Date().toISOString().substring(0, 10),
});

function formatDate(iso) {
  return iso ? iso.split(".")[0].replace("T", " ") : "-";
}

onMounted(async () => {
  const userId = sessionStorage.getItem("userId");
  userFullName.value = sessionStorage.getItem("userEmail") || "";

  const acc = await api.GetAccountByUserIdAsync(userId);
  if (acc.length > 0) {
    selectedAccount.value = acc[0];
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

function openCreate() {
  editing.value = null;
  form.value = {
    type: "Debit",
    amount: null,
    description: "",
    transactionDate: new Date().toISOString().substring(0, 10),
  };
  formError.value = "";
  showModal.value = true;
}

function openEdit(tx) {
  editing.value = tx;
  form.value = {
    type: tx.type, // direct string mapping
    amount: tx.amount,
    description: tx.description,
    transactionDate: tx.createdAt.substring(0, 10),
  };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function saveManual() {
  formError.value = "";

  if (!form.value.amount || form.value.amount <= 0) {
    formError.value = "Amount must be greater than zero";
    return;
  }

  const today = new Date().toISOString().substring(0, 10);
  if (form.value.transactionDate > today) {
    formError.value = "Transaction date cannot be in the future";
    return;
  }

  const typeMap = {
    Credit: 0,
    Debit: 1,
  };

  const payload = {
    accountId: selectedAccount.value.id,
    amount: form.value.amount,
    type: typeMap[form.value.type],
    description: form.value.description,
    transactionDate: form.value.transactionDate,
  };

  try {
    if (editing.value) {
      await api.updateManualTransaction(editing.value.id, payload);
    } else {
      await api.createManualTransaction(selectedAccount.value.id, payload);
    }
    await loadTransactions();
    closeModal();
  } catch (e) {
    formError.value = e?.message || "Failed to save transaction";
  }
}

async function confirmDelete(tx) {
  if (!confirm("Delete this manual transaction?")) return;
  try {
    await api.deleteManualTransaction(tx.id);
    await loadTransactions();
  } catch (e) {
    error.value = e?.message || "Failed to delete transaction";
  }
}
</script>
