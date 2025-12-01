<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">

      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
        Transfer Between Your Accounts
      </h2>

      <div v-if="loading" class="text-center text-gray-500">Loading accounts...</div>

      <div v-else>

        <!-- ========================= -->
        <!-- 🔵 FROM ACCOUNT SELECTOR -->
        <!-- ========================= -->
        <div class="mb-6">

          <label class="block text-sm font-medium mb-2">Transfer from</label>

          <!-- ACCOUNT CARD HEADER -->
          <div
            class="p-4 bg-white dark:bg-gray-800 rounded-md shadow border cursor-pointer flex items-center justify-between"
            @click="showFromDropdown = !showFromDropdown"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                💳
              </div>

              <div>
                <p class="font-semibold text-gray-800 dark:text-gray-200">
                  {{ selectedFrom?.name || 'Select account' }}
                </p>
                <p v-if="selectedFrom" class="text-xs text-gray-500">
                  {{ selectedFrom.accountNumber }}
                </p>
              </div>
            </div>

            <!-- DROPDOWN ARROW -->
            <svg
              :class="showFromDropdown ? 'rotate-180' : ''"
              class="w-5 h-5 text-gray-500 transition-transform"
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
            v-if="showFromDropdown"
            class="mt-1 border rounded-md shadow bg-white dark:bg-gray-800"
          >
            <div
              v-for="acc in accounts"
              :key="acc.id"
              @click="selectFrom(acc)"
              class="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <p class="font-medium">{{ acc.name }}</p>
              <p class="text-xs text-gray-500">{{ acc.accountNumber }}</p>
            </div>
          </div>

        </div>


        <!-- ========================= -->
        <!-- 🟣 TO ACCOUNT SELECTOR -->
        <!-- ========================= -->
        <div class="mb-6">

          <label class="block text-sm font-medium mb-2">Transfer to</label>

          <!-- ACCOUNT CARD HEADER -->
          <div
            class="p-4 bg-white dark:bg-gray-800 rounded-md shadow border cursor-pointer flex items-center justify-between"
            @click="showToDropdown = !showToDropdown"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                💳
              </div>

              <div>
                <p class="font-semibold text-gray-800 dark:text-gray-200">
                  {{ selectedTo?.name || 'Select account' }}
                </p>
                <p v-if="selectedTo" class="text-xs text-gray-500">
                  {{ selectedTo.accountNumber }}
                </p>
              </div>
            </div>

            <!-- DROPDOWN ARROW -->
            <svg
              :class="showToDropdown ? 'rotate-180' : ''"
              class="w-5 h-5 text-gray-500 transition-transform"
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
            v-if="showToDropdown"
            class="mt-1 border rounded-md shadow bg-white dark:bg-gray-800"
          >
            <div
              v-for="acc in accounts"
              :key="acc.id"
              v-show="acc.accountNumber !== selectedFrom?.accountNumber"
              @click="selectTo(acc)"
              class="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <p class="font-medium">{{ acc.name }}</p>
              <p class="text-xs text-gray-500">{{ acc.accountNumber }}</p>
            </div>
          </div>

        </div>


        <!-- ========================= -->
        <!-- 💰 AMOUNT -->
        <!-- ========================= -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">Amount</label>
          <input
            type="number"
            v-model.number="amount"
            class="form-input w-full"
            placeholder="0.00"
            min="1"
          />
        </div>

        <p v-if="error" class="text-red-600 text-sm mb-4">{{ error }}</p>

        <button
          class="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          @click="submitTransfer"
        >
          Confirm Transfer
        </button>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { api } from "@/services/api"

const router = useRouter()

const accounts = ref([])
const selectedFrom = ref(null)
const selectedTo = ref(null)

const showFromDropdown = ref(false)
const showToDropdown = ref(false)

const amount = ref(0)
const error = ref("")
const loading = ref(true)

onMounted(async () => {
  try {
    const userId = sessionStorage.getItem("userId")

    const result = await api.GetAccountByUserIdAsync(userId)
    accounts.value = Array.isArray(result) ? result : []

  } catch {
    error.value = "Failed to load accounts"
  } finally {
    loading.value = false
  }
})

function selectFrom(acc) {
  selectedFrom.value = acc
  showFromDropdown.value = false

  if (selectedTo.value?.accountNumber === acc.accountNumber) {
    selectedTo.value = null // reset TO if same
  }
}

function selectTo(acc) {
  selectedTo.value = acc
  showToDropdown.value = false
}

async function submitTransfer() {
  error.value = ""

  if (!selectedFrom.value || !selectedTo.value) {
    error.value = "Both accounts must be selected"
    return
  }

  if (amount.value <= 0) {
    error.value = "Amount must be greater than 0"
    return
  }

  try {
    const response = await api.transferFunds({
      fromAccountId: selectedFrom.value.accountNumber,
      toAccountId: selectedTo.value.accountNumber,
      amount: amount.value
    })

    if (!response?.isSuccess) {
      error.value = response?.message || "Transfer failed"
      return
    }

    sessionStorage.setItem("transfer_from", selectedFrom.value.accountNumber)
    sessionStorage.setItem("transfer_to", selectedTo.value.accountNumber)
    sessionStorage.setItem("transfer_amount", amount.value)

    router.push({ name: "TransferSuccess" })

  } catch {
    error.value = "Transfer failed due to server error"
  }
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
