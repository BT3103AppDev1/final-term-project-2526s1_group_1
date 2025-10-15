<template>
  <div id="app">
    <!-- Show navbar on all pages except auth pages -->
    <Navbar v-if="!isAuthPage" />
    
    <!-- Main content -->
    <main :class="{ 'with-navbar': !isAuthPage }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const route = useRoute()

// Hide navbar on authentication pages
const isAuthPage = computed(() => {
  const authPaths = ['/auth', '/login', '/register', '/reset-password']
  return authPaths.some(path => route.path.startsWith(path))
})
</script>

<style>
/* App-specific styles only - global styles are in global.css */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

main.with-navbar {
  min-height: calc(100vh - 70px);
}
</style>