<template>
  <form @submit.prevent="loginUser" class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1">Email</label>
      <input
        v-model="email"
        type="email"
        placeholder="you@example.com"
        class="w-full rounded-md border border-input px-3 py-2 text-sm bg-background"
        required
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Password</label>
      <input
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

    <p v-if="errorMessage" class="text-red-500 text-sm text-center mt-2">
      {{ errorMessage }}
    </p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const loginUser = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    // ✅ 로그인 성공 → browse로 이동
    router.push('/browse')
  } catch (error) {
    console.error('Login failed:', error)
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      errorMessage.value = 'Invalid email or password.'
    } else {
      errorMessage.value = 'Login failed. Please try again.'
    }
  }
}
</script>
