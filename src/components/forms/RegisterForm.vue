<template>
  <form @submit.prevent="registerUser" class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1">Full Name</label>
      <input
        v-model="name"
        type="text"
        placeholder="John Doe"
        class="w-full rounded-md border border-input px-3 py-2 text-sm bg-background"
        required
      />
    </div>

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
      Create Account
    </button>

    <!-- 에러 메시지 -->
    <p v-if="errorMessage" class="text-red-500 text-sm text-center mt-2">
      {{ errorMessage }}
    </p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/firebase/config'

const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

const registerUser = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    // ✅ Firebase 유저 이름 업데이트
    await updateProfile(user, { displayName: name.value })

    // ✅ 회원가입 성공 → browse로 이동
    router.push('/browse')
  } catch (error) {
    console.error('Registration failed:', error)
    if (error.code === 'auth/email-already-in-use') {
      errorMessage.value = 'This email is already in use.'
    } else if (error.code === 'auth/weak-password') {
      errorMessage.value = 'Password should be at least 6 characters.'
    } else {
      errorMessage.value = 'Registration failed. Please try again.'
    }
  }
}
</script>
