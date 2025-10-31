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

      <!-- Features List -->
      <div class="mt-8 space-y-4">
        <div class="flex items-center gap-3 text-slate-700">
          <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <span class="text-black text-lg font-bold">✓</span>
          </div>
          <span class="font-medium text-sm">Student-verified community</span>
        </div>
        <div class="flex items-center gap-3 text-slate-700">
          <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <span class="text-black text-lg font-bold">✓</span>
          </div>
          <span class="font-medium text-sm">Secure messaging & transactions</span>
        </div>
        <div class="flex items-center gap-3 text-slate-700">
          <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <span class="text-black text-lg font-bold">✓</span>
          </div>
          <span class="font-medium text-sm">Save up to 70% on textbooks</span>
        </div>
      </div>

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