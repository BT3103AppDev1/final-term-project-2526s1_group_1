<template>
  <nav id="nav" class="navbar">
    <!-- Logo Section -->
    <router-link to="/" class="nav-logo-link">
      <div class="nav-logo">
        <div class="logo-icon">PS</div>
        <span class="logo-text">PeerSwap</span>
      </div>
    </router-link>
    <!-- Navigation Links -->
    <div class="link-button-container">
      <div class="nav-links">
        <router-link to="/browse" class="nav-link">Browse</router-link>
        <router-link v-if="isLoggedIn" to="/list-item" class="nav-link">List Item</router-link>
        <router-link v-if="isLoggedIn" to="/rentals" class="nav-link">My Rentals</router-link>
        <router-link v-if="isLoggedIn" to="/messages" class="nav-link">Messages</router-link>
      </div>
      <!-- Authentication Section -->
      <div v-if="!isLoggedIn" class="login-register-buttons">
        <router-link to="/auth/login" class="auth-button login-btn">Login</router-link>
        <router-link to="/auth/register" class="auth-button register-btn">Register</router-link>
      </div>
      <!-- User Profile Dropdown -->
      <div v-else class="profile-dropdown" @click="toggleDropdown">
        <img :key="`navbar-avatar-${userProfile?.profileImageUrl || 'default'}`"
          :src="userProfileImage || defaultProfileImage" alt="Profile" class="profile-icon"/>
        <div v-if="dropdownOpen" class="dropdown-content" @click.stop>
          <router-link to="/profile" class="dropdown-option" @click="closeDropdown">
            <svg class="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            Your Profile
          </router-link>
          
          <router-link to="/list-item" class="dropdown-option"@click="closeDropdown">
            <svg class="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            List New Item
          </router-link>
          
          <router-link to="/rentals" class="dropdown-option" @click="closeDropdown"
          >
            <svg class="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            My Rentals
          </router-link>
          
          <div class="dropdown-divider"></div>
          <button @click="logout" class="dropdown-option logout-option">
            <svg class="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            Log Out
          </button>
        </div>
      </div>
    </div>
    <!-- Mobile Menu Toggle (for future mobile responsiveness) -->
    <button class="mobile-menu-toggle" @click="toggleMobileMenu">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
      </svg>
    </button>
  </nav>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/config'

// Router and auth
const router = useRouter()
const auth = getAuth()

// Reactive data
const isLoggedIn = ref(false)
const dropdownOpen = ref(false)
const mobileMenuOpen = ref(false)
const uid = ref('')
const userProfile = ref(null)
// Default profile image
const defaultProfileImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmNTllMGIiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+Cjwvc3ZnPgo8L3N2Zz4K'
// Computed
const userProfileImage = computed(() => {
  const imageUrl = userProfile.value?.profileImageUrl || defaultProfileImage
  return imageUrl
})
const toggleDropdown = () => {dropdownOpen.value = !dropdownOpen.value}
const closeDropdown = () => {dropdownOpen.value = false}
const toggleMobileMenu = () => {mobileMenuOpen.value = !mobileMenuOpen.value}
const logout = async () => {
    try {
        // Update lastSeen timestamp before signing out
        if (uid.value) {
            const userDocRef = doc(db, "User Information", uid.value)
            await updateDoc(userDocRef, {
                lastSeen: serverTimestamp(),
                online: false
            })
        }
        
        await signOut(auth)
        dropdownOpen.value = false
        router.push('/')
    } catch (error) {
        console.error('Error during logout:', error)
        // Still sign out even if updating lastSeen fails
        await signOut(auth)
        dropdownOpen.value = false
        router.push('/')
    }
}
const loadUserProfile = async (userId) => {
    const userDocRef = doc(db, "User Information", userId)
    const userDoc = await getDoc(userDocRef)
    if (userDoc.exists()) {userProfile.value = userDoc.data()}
}
const handleClickOutside = (event) => {
  if (!event.target.closest('.profile-dropdown')) {dropdownOpen.value = false}
}
watch(() => router.currentRoute.value.path, async (newPath) => {
  if (newPath === '/profile' && uid.value) {
    await loadUserProfile(uid.value)
  }
})
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {//listen for auth state changes
    if (user) {
      isLoggedIn.value = true
      uid.value = user.uid
      await loadUserProfile(user.uid)
    } else {
      // User logged out - reset all authentication state
      isLoggedIn.value = false
      uid.value = ''
      userProfile.value = null
      dropdownOpen.value = false
    }
  })
  document.addEventListener('click', handleClickOutside)
})
</script>
<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  width: 100%;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 1rem;
  position: sticky;
  top: 0;
  z-index: 50;
}

/* Logo Section */
.nav-logo-link {
  text-decoration: none;
  color: inherit;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f59e0b;
}

/* Navigation Links */
.link-button-container {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #f59e0b;
  background-color: #fef3c7;
}

.nav-link.router-link-active {
  color: #f59e0b;
  background-color: #fef3c7;
}

/* Authentication Buttons */
.login-register-buttons {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.auth-button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.login-btn {
  color: #f59e0b;
  border: 1px solid #f59e0b;
  background-color: transparent;
}

.login-btn:hover {
  background-color: #fef3c7;
}

.register-btn {
  color: white;
  background-color: #f59e0b;
  border: 1px solid #f59e0b;
}

.register-btn:hover {
  background-color: #d97706;
}

/* Profile Dropdown */
.profile-dropdown {
  position: relative;
  cursor: pointer;
}

.profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f59e0b;
  transition: transform 0.2s;
}

.profile-icon:hover {
  transform: scale(1.05);
}

.dropdown-content {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  min-width: 200px;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  z-index: 1000;
}

.dropdown-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-option:hover {
  background-color: #f9fafb;
  color: #f59e0b;
}

.logout-option:hover {
  background-color: #fee2e2;
  color: #dc2626;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.dropdown-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 0.5rem 0;
}

/* Mobile Menu Toggle */
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  color: #374151;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu-toggle svg {
  width: 24px;
  height: 24px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar {
    padding: 0 0.5rem;
  }
  
  .nav-links {
    display: none;
  }
  
  .mobile-menu-toggle {
    display: block;
  }
  
  .logo-text {
    display: none;
  }
  
  .login-register-buttons {
    gap: 0.5rem;
  }
  
  .auth-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .link-button-container {
    gap: 1rem;
  }
  
  .dropdown-content {
    min-width: 180px;
    right: -1rem;
  }
}
</style>
