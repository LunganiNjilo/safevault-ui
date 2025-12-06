<template>
  <nav class="bg-white dark:bg-gray-800 shadow-md relative">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">

      <!-- Left: Logo -->
      <div class="flex items-center space-x-4">
        <router-link to="/home" class="flex items-center">
          <img
            src="@/assets/img/SafeVault.png"
            alt="logo"
            class="w-12 h-12 mr-3 object-contain"
          />
        </router-link>
      </div>

      <!-- Center nav links -->
      <ul class="hidden md:flex items-center space-x-4 text-sm font-medium text-gray-700 dark:text-gray-200">
        <li>
          <router-link to="/home" class="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            Home
          </router-link>
        </li>

        <li>
          <router-link to="/transact" class="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            Transact
          </router-link>
        </li>

        <!-- BUY DROPDOWN (Click-based + Outside-close) -->
        <li class="relative" ref="buyMenuRef">
          <button
            @click="toggleBuy"
            class="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1"
          >
            Buy
            <span class="text-xs">▼</span>
          </button>

          <!-- Dropdown -->
          <div
            v-if="openBuy"
            class="absolute left-0 mt-1 w-40 bg-white dark:bg-gray-700 shadow-lg rounded-md border border-gray-200 dark:border-gray-600 z-50"
          >
            <router-link
              to="/buy/airtime"
              @click="openBuy = false"
              class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              📱 Airtime
            </router-link>
          </div>
        </li>
      </ul>

      <!-- Right: User Profile, Contact button, Mobile menu -->
      <div class="flex items-center space-x-3">

        <!-- USER PROFILE DROPDOWN -->
        <div class="relative hidden md:block">
          <div
            class="flex items-center space-x-2 cursor-pointer select-none px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            @click="userMenuOpen = !userMenuOpen"
          >
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            <!-- Username -->
            <span class="text-gray-700 dark:text-gray-200 text-sm font-medium">
              {{ userName }}
            </span>

            <svg
              class="w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform"
              :class="{ 'rotate-180': userMenuOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <!-- Dropdown Menu -->
          <div
            v-if="userMenuOpen"
            class="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-700 shadow-lg rounded-md border border-gray-200 dark:border-gray-600 z-50"
          >
            <router-link
              to="/profile"
              @click="closeUserMenu"
              class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
            >
              👤 Profile
            </router-link>

            <button
              @click="logoutAndClose"
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
            >
              🔒 Sign Out
            </button>
          </div>
        </div>

        <!-- Contact Us Button -->
        <div class="hidden md:block">
          <button
            @click="showContact = true"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 border border-blue-700 rounded-full hover:bg-blue-50 transition"
          >
            📞 Contact Us
          </button>
        </div>

        <ContactUsModal :open="showContact" @close="showContact = false" />

        <!-- Mobile menu button -->
        <button @click="toggle" class="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg class="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="open" class="md:hidden bg-white dark:bg-gray-800 border-t">
      <ul class="px-4 py-3 space-y-1">
        <li><router-link @click="close" to="/home">Home</router-link></li>
        <li><router-link @click="close" to="/transact">Transact</router-link></li>

        <!-- Buy mobile dropdown -->
        <li>
          <details class="group">
            <summary class="flex justify-between cursor-pointer py-2">Buy</summary>
            <div class="pl-4 space-y-1 mt-1">
              <router-link @click="close" to="/buy/airtime">📱 Airtime</router-link>
            </div>
          </details>
        </li>

        <!-- Profile mobile -->
        <li>
          <router-link @click="close" to="/profile">👤 Profile</router-link>
        </li>

        <li>
          <button @click="logout" class="text-red-600 dark:text-red-400 font-medium">🔒 Sign Out</button>
        </li>

        <!-- Contact Us mobile -->
        <li>
          <button @click="showContact = true" class="text-purple-600 dark:text-purple-400 font-medium">Contact Us</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import ContactUsModal from "@/components/ContactUsModal.vue";

const showContact = ref(false);
const open = ref(false);
const openBuy = ref(false);
const userMenuOpen = ref(false);
const buyMenuRef = ref(null);

/**
 * Username is reactive, but we manually refresh it
 * whenever sessionStorage changes (via a custom event).
 */
const userName = ref("User");

function refreshUserName() {
  const firstName = sessionStorage.getItem("firstName") || "";
  const lastName = sessionStorage.getItem("lastName") || "";
  const email = sessionStorage.getItem("userEmail") || "";

  let fullName = `${firstName} ${lastName}`.trim();
  if (!fullName && email) {
    fullName = email.split("@")[0];
  }

  userName.value = fullName || "User";
}

/* Toggle Buy */
function toggleBuy() {
  openBuy.value = !openBuy.value;
}

/* Close Buy when clicking outside */
function handleClickOutside(e) {
  if (buyMenuRef.value && !buyMenuRef.value.contains(e.target)) {
    openBuy.value = false;
  }
}

/* Profile dropdown */
function closeUserMenu() {
  userMenuOpen.value = false;
}

function logoutAndClose() {
  userMenuOpen.value = false;
  logout();
}

function logout() {
  sessionStorage.clear();
  window.location.href = "/login";
}

function toggle() {
  open.value = !open.value;
}

function close() {
  open.value = false;
}

onMounted(() => {
  // Initial load
  refreshUserName();

  // Listen for custom profile update event
  window.addEventListener("profile-updated", refreshUserName);

  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("profile-updated", refreshUserName);
  document.removeEventListener("click", handleClickOutside);
});
</script>
