import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

export function useLogout() {
  const router = useRouter()
  const isLoggingOut = ref(false)
  const error = ref(null)

  const logoutUser = async () => {
    isLoggingOut.value = true
    error.value = null
    try {
      await signOut(auth)
      // Clear any user state if needed (optional)
      router.push('/')
    } catch (err) {
      console.error('Logout failed:', err)
      error.value = err.message
    } finally {
      isLoggingOut.value = false
    }
  }

  return { logoutUser, isLoggingOut, error }
}
