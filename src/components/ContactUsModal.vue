<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="close"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6"
    >
      <!-- Heading -->
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Contact Us
      </h2>

      <!-- South Africa Contact -->
      <div class="flex items-center gap-3 mb-4">
        <img
          src="https://flagcdn.com/w40/za.png"
          class="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p class="text-gray-700 dark:text-gray-300 font-medium">South Africa</p>
          <p class="text-blue-600 dark:text-blue-400 font-semibold">
            +27 11 123 4567
          </p>
        </div>
      </div>

      <!-- International Contact -->
      <div class="flex items-center gap-3 mb-4">
        <div
          class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300"
        >
          🌍
        </div>
        <div>
          <p class="text-gray-700 dark:text-gray-300 font-medium">International</p>
          <p class="text-blue-600 dark:text-blue-400 font-semibold">
            +1 234 567 8900
          </p>
        </div>
      </div>

      <!-- Email Contact -->
      <div class="flex items-center gap-3 mb-6">
        <div
          class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-700 dark:text-purple-300"
        >
          ✉️
        </div>
        <div>
          <p class="text-gray-700 dark:text-gray-300 font-medium">Email</p>
          <p class="text-blue-600 dark:text-blue-400 font-semibold">
            support@yourbank.com
          </p>
        </div>
      </div>

      <!-- Close Button -->
      <button
        @click="close"
        class="w-full mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
});

const emit = defineEmits(["close"]);

function close() {
  emit("close");
}
</script>
