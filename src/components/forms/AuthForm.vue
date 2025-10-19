<script setup>
import LoginForm from "./LoginForm.vue";
import RegisterForm from "./RegisterForm.vue";
import ResetPasswordForm from "./ResetPasswordForm.vue";
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { auth, db } from '@/firebase/config';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const route = useRoute();
const router = useRouter();

// Reactive state
const authOption = ref(false);
const state = ref(route.params.state === "login" ? "Login" : "Register");

// Computed property for dynamic text
const stateText = computed(() => state.value);

// Methods
const toggleAuthState = () => {
  state.value = state.value === "Login" ? "Register" : "Login";
};

const updateStateToVerify = () => {
  state.value = "Verify";
};

const setAuthOptionToEmail = () => {
  authOption.value = "Email";
};

const setAuthOptionToGmail = async () => {
  authOption.value = "Gmail";
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log(result.user.email);

    const user = result.user;

    // Check if this user exists in Firestore
    const docRef = doc(db, "User Information", user.uid);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      // New user - Create a new entry in Firestore
      await setDoc(doc(db, "User Information", user.uid), {
        name: user.displayName || '',
        email: user.email,
        profileImageUrl: user.photoURL || '',
        description: '',
        location: '',
        skills: '',
        interests: '',
        shortBio: '',
        linkedin: '',
        instagram: '',
        telegram: '',
        rating: 0,
        reviewCount: 0,
        totalRentals: 0,
        responseTime: 'Not set',
        joinedDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        }),
        stats: {
          itemsListed: 0,
          itemsRented: 0,
          totalEarnings: 0,
          successfulTransactions: 0,
        },
        savedProjects: [],
        pastProjects: [],
        currentProjects: [],
        hostedProjects: [],
        pendingProjects: [],
        filledQuestionaire: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Redirect to profile setup or main page
      router.push({ name: 'Profile', params: { id: user.uid } });
    } else {
      // Existing user - Redirect to main page
      router.push("/browse");
    }
  } catch (error) {
    console.error("Authentication with Google failed", error);
    // You could show an error message here
  }
};

// Watch for route changes
const unwatchRoute = route.params.state ? 
  () => { state.value = route.params.state === "login" ? "Login" : "Register"; } : 
  () => {};

// Handle state change from child component
const changeStateToLogin = () => {
  state.value = "Login";
};
</script>

<template>
  <div class="authForm-container">
    <div class="logo">
      <div class="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
        <span class="text-primary-foreground font-bold text-sm">PS</span>
      </div>
      <h1 class="text-2xl font-bold text-foreground">PeerSwap</h1>
    </div>
    
    <div v-show="!authOption" class="auth-options-wrapper">
      <button class="auth-options" type="button" @click.prevent="setAuthOptionToEmail">
        <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
        </svg>
        <h4>{{ stateText }} with Email</h4>
      </button>
      
      <button class="auth-options" type="button" @click.prevent="setAuthOptionToGmail">
        <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
          <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <h4>{{ stateText }} with Google</h4>
      </button>
    </div>
    
    <div v-if="authOption === 'Email'" class="auth-form-wrapper">
      <LoginForm v-if="state === 'Login'" />
      <RegisterForm v-else-if="state === 'Register'" />
      <ResetPasswordForm v-else @changeStateToLogin="changeStateToLogin" />
    </div>
    
    <button v-show="authOption === 'Email'" type="button" class="auth-options mt-4" @click.prevent="setAuthOptionToGmail">
      <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
        <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      <h4>{{ stateText }} with Google</h4>
    </button>
    
    <button v-show="authOption === 'Gmail'" type="button" class="auth-options mt-4" @click.prevent="setAuthOptionToEmail">
      <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
      </svg>
      <h4>{{ stateText }} with Email</h4>
    </button>
    
    <div class="other-auth-options">
      <router-link 
        v-if="state === 'Login'" 
        :to="{ name: 'register' }" 
        class="router-link"
        @click="toggleAuthState"
      >
        <h4>Don't have an account? Register</h4>
      </router-link>
      
      <router-link 
        v-else 
        :to="{ name: 'login' }" 
        class="router-link"
        @click="toggleAuthState"
      >
        <h4>Already have an account? Login</h4>
      </router-link>
      
      <button 
        v-show="state === 'Login'" 
        type="button" 
        @click="updateStateToVerify"
        class="forgot-password-btn"
      > 
        <h4>Forgot Password?</h4>
      </button>
    </div>
  </div>
</template>

<style scoped>
.authForm-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #F9EEEE;
  min-height: 100vh;
  width: 100%;
  padding: 2rem;
}

.logo {
  width: 350px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 2rem;
}

.auth-options-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 350px;
  gap: 12px;
}

.auth-options {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 48px;
  width: 350px;
  background-color: white;
  color: black;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
  font-weight: 500;
}

.auth-options:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.auth-form-wrapper {
  width: 350px;
  margin: 1rem 0;
}

.other-auth-options {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 350px;
  gap: 12px;
}

.other-auth-options .router-link,
.forgot-password-btn {
  outline: none;
  border: none;
  background-color: transparent;
  color: #f59e0b;
  font-size: 14px;
  padding: 8px;
  cursor: pointer;
  transition: color 0.2s;
}

.other-auth-options .router-link:hover,
.forgot-password-btn:hover {
  color: #d97706;
}

.other-auth-options h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
}
</style>
