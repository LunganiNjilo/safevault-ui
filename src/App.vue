<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">

    <!-- Hide NavBar on certain pages -->
    <Navbar v-if="!hideNavBar" />

    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const route = useRoute()

// Routes where navbar must NOT show
const hiddenRoutes = ['/login', '/create-account', '/forgot-password']

const hideNavBar = computed(() => hiddenRoutes.includes(route.path))
</script>
