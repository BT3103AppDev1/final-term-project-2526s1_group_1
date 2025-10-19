<template>
  <div class="bg-card rounded-lg shadow-md p-6">
    <div class="flex justify-around border-b border-border mb-6">
      <button
        @click="goTo('login')"
        :class="[
          'px-4 py-2 font-medium text-sm transition-colors',
          activeTab === 'login'
            ? 'text-primary border-b-2 border-primary'
            : 'text-muted-foreground hover:text-foreground'
        ]"
      >
        Log In
      </button>
      <button
        @click="goTo('register')"
        :class="[
          'px-4 py-2 font-medium text-sm transition-colors',
          activeTab === 'register'
            ? 'text-primary border-b-2 border-primary'
            : 'text-muted-foreground hover:text-foreground'
        ]"
      >
        Register
      </button>
    </div>

    <div>
      <component :is="activeComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Components for the tabs
import LoginForm from '@/components/forms/LoginForm.vue'
import RegisterForm from '@/components/forms/RegisterForm.vue'

const router = useRouter()
const route = useRoute()

// Track which tab is active
const activeTab = ref(route.name === 'register' ? 'register' : 'login')

// Dynamically show login or register component
const activeComponent = computed(() =>
  activeTab.value === 'login' ? LoginForm : RegisterForm
)

// Navigate between tabs
function goTo(tab) {
  activeTab.value = tab
  router.push({ name: tab })
}
</script>

<style scoped>
button {
  transition: all 0.2s ease;
}
</style>
