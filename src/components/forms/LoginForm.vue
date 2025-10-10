<template>
  <form @submit.prevent="loginUser" class="space-y-4">
    <div>
      <label for="login-email" class="block text-sm font-medium mb-1">Email</label>
      <input
        id="login-email"
        v-model="email"
        type="email"
        placeholder="you@example.com"
        class="w-full rounded-md border border-input px-3 py-2 text-sm bg-background"
        required
      />
    </div>

    <div>
      <label for="login-password" class="block text-sm font-medium mb-1">Password</label>
      <input
        id="login-password"
        v-model="password"
        type="password"
        placeholder="••••••••"
        class="w-full rounded-md border border-input px-3 py-2 text-sm bg-background"
        required
      />
    </div>

    <button
      type="submit"
      class="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition"
    >
      Sign In
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = getAuth()

async function loginUser() {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)

    // ✅ Redirect to browse after successful login
    router.push('/browse')
  } catch (error) {
    console.error('Login failed:', error.message)
    alert('Login failed: ' + error.message)
  }
}
</script>
