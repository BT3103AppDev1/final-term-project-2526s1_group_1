<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-6">
    <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
    <h2 class="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
    <p class="text-gray-500 mb-6 max-w-md">
      Sorry, we couldn’t find the page you were looking for.  
      It might have been moved or deleted.
    </p>

    <router-link
      to="/"
      class="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
    >
      Go Back Home
    </router-link>
  </div>
</template>

<script setup>
// No script logic needed for a static 404 page
</script>

<style scoped>
body {
  background-color: #f9fafb;
}
</style>
