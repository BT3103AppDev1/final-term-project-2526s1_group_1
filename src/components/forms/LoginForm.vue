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
      <div class="relative">
        <input
          id="login-password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
          class="w-full rounded-md border border-input px-3 py-2 pr-10 text-sm bg-background"
          required
        />
        <button
          type="button"
          @click="togglePassword"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
          </svg>
        </button>
      </div>
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
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const email = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)
const router = useRouter()
const auth = getAuth()

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

    if (!user.emailVerified) {
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