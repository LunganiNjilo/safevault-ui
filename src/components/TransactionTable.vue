<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-auto">
    <table class="min-w-full divide-y">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Description</th>
          <th class="px-4 py-2 text-right text-xs font-medium text-gray-500">In</th>
          <th class="px-4 py-2 text-right text-xs font-medium text-gray-500">Out</th>
          <th class="px-4 py-2 text-right text-xs font-medium text-gray-500">Fees</th>
          <th class="px-4 py-2 text-right text-xs font-medium text-gray-500">Balance</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
        <tr v-for="row in rows" :key="row.id">
          <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{{ row.date }}</td>
          <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{{ row.desc }}</td>
          <td class="px-4 py-3 text-sm text-right text-green-600 dark:text-green-400">{{ row.in }}</td>
          <td class="px-4 py-3 text-sm text-right text-red-600 dark:text-red-400">{{ row.out }}</td>
          <td class="px-4 py-3 text-sm text-right text-gray-500">{{ row.fees }}</td>
          <td class="px-4 py-3 text-sm text-right font-semibold">{{ row.balance }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const rows = ref([
  { id: 1, date: '2025-11-15', desc: 'Salary', in: 'R 5,000.00', out: '-', fees: '-', balance: 'R 5,000.00' },
  { id: 2, date: '2025-11-16', desc: 'Groceries', in: '-', out: 'R 420.00', fees: 'R 0.00', balance: 'R 4,580.00' },
  // ... add a few sample rows
])
</script>
