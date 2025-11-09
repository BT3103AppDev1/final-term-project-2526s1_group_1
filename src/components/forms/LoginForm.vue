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
      :disabled="loading"
    >
      <span v-if="loading">Signing In...</span>
      <span v-else>Sign In</span>
    </button>

    <!-- Forgot Password Link -->
    <div class="text-center">
      <button
        type="button"
        @click="$emit('changeToReset')"
        class="text-sm text-primary hover:text-primary/80 underline"
      >
        Forgot your password?
      </button>
    </div>

    <!-- Register Link -->
    <div class="text-center text-sm text-muted-foreground">
      Don't have an account?
      <button
        type="button"
        @click="$emit('changeToRegister')"
        class="text-primary hover:text-primary/80 underline ml-1"
      >
        Sign up
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signInWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth'

const email = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)
const router = useRouter()
const auth = getAuth()

// Emails that should bypass verification and stay signed in
const bypassVerificationEmails = ['testuser@test.com']

// Define emits
const emit = defineEmits(['changeToRegister', 'changeToReset', 'loginSuccess'])

// Toggle password visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

async function loginUser() {
  if (!email.value || !password.value) {
    alert('Please fill in all fields')
    return
  }

  loading.value = true
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user
    const emailLower = (email.value || '').toLowerCase()

    // If user is not verified and NOT in bypass list, resend verification and prevent login
    if (!user.emailVerified && !bypassVerificationEmails.includes(emailLower)) {
      try {
        // resend verification email
        await sendEmailVerification(user)
      } catch (e) {
        console.error('Failed to resend verification:', e)
      }
      // sign out so they cannot proceed
      await signOut(auth)
      alert('Email not verified. A verification email has been (re)sent — please verify before logging in.')
      return
    }

    // If user is unverified but in bypass list, allow login
    // Emit login success event
    emit('loginSuccess', user)
    router.push('/browse')
  } catch (error) {
    console.error('Login failed:', error.message)
    
    let errorMessage = 'Login failed. '
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage += 'No account found with this email address.'
        break
      case 'auth/wrong-password':
        errorMessage += 'Incorrect password.'
        break
      case 'auth/invalid-email':
        errorMessage += 'Please enter a valid email address.'
        break
      case 'auth/too-many-requests':
        errorMessage += 'Too many failed attempts. Please try again later.'
        break
      default:
        errorMessage += 'Please check your credentials and try again.'
    }
    
    alert(errorMessage)
  } finally {
    loading.value = false
  }
}
</script>