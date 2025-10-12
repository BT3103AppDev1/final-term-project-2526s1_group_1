<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-2 mb-4">
          <div class="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <span class="text-primary-foreground font-bold">PS</span>
          </div>
          <h1 class="text-2xl font-bold text-foreground">PeerSwap</h1>
        </div>
        <p class="text-muted-foreground">Student-to-Student Rental Platform</p>
      </div>

      <AuthTabs />

      <div class="mt-6 text-center">
        <p class="text-sm text-muted-foreground">
          New to PeerSwap?
          <router-link to="/browse" class="text-primary hover:underline ml-1">
            Browse items as guest
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import AuthTabs from '@/components/AuthTabs.vue'
</script>

<style scoped>
/* Add any custom styles here */
</style>