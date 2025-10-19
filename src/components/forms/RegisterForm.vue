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
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from 'firebase/auth'

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()
const auth = getAuth()

const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'u.nus.edu']
function isSchoolEmail(email) {
  if(!email) return false
  const parts = email.toLowerCase().split('@')
  if(parts.length !== 2) return false
  return allowedDomains.includes(parts[1])
}

async function registerUser() {
  if (!isSchoolEmail(email.value)) {
    alert('Please use a valid email from the allowed domains: ' + allowedDomains.join(', '))
    return
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    // Update Firebase user profile with display name
    await updateProfile(user, { displayName: name.value })

    await sendEmailVerification(user)

    // force sign out so the user can't use app until they verify
    await signOut(auth)
    
    alert('Registration successful. A verification email was sent — please verify before logging in.')
    router.push('/')
  } catch (error) {
    console.error('Registration failed:', error.message)
    alert('Registration failed: ' + error.message)
  }
}
</script>