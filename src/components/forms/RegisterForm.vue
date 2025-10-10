<template>
  <form @submit.prevent="registerUser" class="space-y-4">
    <div>
      <label for="register-name" class="block text-sm font-medium mb-1">Full Name</label>
      <input
        id="register-name"
        v-model="name"
        type="text"
        placeholder="John Doe"
        class="w-full rounded-md border border-input px-3 py-2 text-sm bg-background"
        required
      />
    </div>

    <div>
      <label for="register-email" class="block text-sm font-medium mb-1">Email</label>
      <input
        id="register-email"
        v-model="email"
        type="email"
        placeholder="you@example.com"
        class="w-full rounded-md border border-input px-3 py-2 text-sm bg-background"
        required
      />
    </div>

    <div>
      <label for="register-password" class="block text-sm font-medium mb-1">Password</label>
      <input
        id="register-password"
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
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()
const auth = getAuth()

async function registerUser() {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    // ✅ Update Firebase user profile with display name
    await updateProfile(user, { displayName: name.value })

    // ✅ Redirect to browse page
    router.push('/browse')
  } catch (error) {
    console.error('Registration failed:', error.message)
    alert('Registration failed: ' + error.message)
  }
}
</script>
