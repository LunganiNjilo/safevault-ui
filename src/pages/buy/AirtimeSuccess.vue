<template>
  <div class="flex flex-col items-center justify-center h-screen text-center px-6">
    <div class="text-green-600 text-5xl mb-4">✔</div>

    <h1 class="text-2xl font-semibold mb-2">Airtime Purchase Successful</h1>

    <p class="text-gray-600 mb-6">
      You have successfully purchased<br />
      <strong>R {{ amount }}</strong> airtime for<br />
      <strong>{{ cell }}</strong> ({{ operator }}).
    </p>

    <router-link
      to="/home"
      class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
    >
      Return Home
    </router-link>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router"
const route = useRoute()

const amount = route.query.amount
const cell = route.query.cell
const operator = route.query.operator
const newBalance = Number(route.query.newBalance)
</script>
