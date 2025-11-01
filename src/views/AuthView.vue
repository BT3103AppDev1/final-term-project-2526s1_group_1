<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex">
    <!-- Left Side Branding -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-amber-600 p-12 flex-col justify-between relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
        <div class="absolute bottom-32 right-16 w-24 h-24 bg-white rounded-full"></div>
        <div class="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full"></div>
      </div>
      <div class="relative z-10">
        <!-- Logo and Title -->
        <div class="flex items-center gap-3 mb-8">
          <div class="h-12 w-12 rounded-xl bg-white bg-opacity-30 backdrop-blur-sm flex items-center justify-center border border-white border-opacity-20">
            <span class="text-orange-600 font-bold text-lg">PS</span>
          </div>
          <h1 class="text-3xl font-bold text-white drop-shadow-lg">
            PeerSwap
          </h1>
        </div>        <h2 class="text-3xl font-bold text-white mb-6 leading-tight">
          Connect with Fellow Students
        </h2>
        <p class="text-orange-100 text-lg leading-relaxed">
          Share textbooks, electronics, and equipment with your student community. Save money, reduce waste, and build lasting connections.
        </p>
      </div>

      <!-- Features List -->
      <div class="relative z-10 space-y-4">
        <div class="flex items-center gap-3 text-white">
          <div class="w-8 h-8 bg-white bg-opacity-30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white border-opacity-20">
            <span class="text-black text-lg font-bold">✓</span>
          </div>
          <span class="font-medium">Student-verified community</span>
        </div>
        <div class="flex items-center gap-3 text-white">
          <div class="w-8 h-8 bg-white bg-opacity-30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white border-opacity-20">
            <span class="text-black text-lg font-bold">✓</span>
          </div>
          <span class="font-medium">Secure messaging & transactions</span>
        </div>
      </div>
    </div>

    <!-- Right Side - Auth Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
      <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden flex items-center justify-center gap-3 mb-8">
          <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
            <span class="text-white font-bold text-lg">PS</span>
          </div>
          <h1 class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            PeerSwap
          </h1>
        </div>
        <!-- Auth Card -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{{ getTitle() }}</h2>
            <p class="text-gray-600">{{ getSubtitle() }}</p>
          </div>
          <!-- Form Content -->
          <div class="space-y-6">
            <!-- Login Form -->
            <LoginForm v-if="currentView === 'login'" @changeToRegister="currentView = 'register'"
              @changeToReset="currentView = 'reset'" @loginSuccess="handleAuthSuccess"/>
            <!-- Register Form -->
            <RegisterForm v-else-if="currentView === 'register'" @changeToLogin="currentView = 'login'"
              @registerSuccess="handleAuthSuccess"/>
            <!-- Reset Password Form -->
            <ResetPasswordForm v-else-if="currentView === 'reset'" @changeStateToLogin="currentView = 'login'"/>
            <AuthForm v-else-if="currentView === 'auth'" @authSuccess="handleAuthSuccess"/>
          </div>

          <!-- Footer Links -->
          <div v-if="currentView !== 'auth'" class="mt-8 pt-6 border-t border-gray-100">
            <div class="text-center space-y-3">

              <div v-if="currentView === 'register'">
                <button 
                  @click="currentView = 'login'"
                  class="text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
                >
                  Already have an account? <span class="underline">Sign in</span>
                </button>
              </div>

              <div v-else-if="currentView === 'reset'">
                <button 
                  @click="currentView = 'login'"
                  class="text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
                >
                  <span class="underline">Back to sign in</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoginForm from '@/components/forms/LoginForm.vue';
import RegisterForm from '@/components/forms/RegisterForm.vue';
import ResetPasswordForm from '@/components/forms/ResetPasswordForm.vue';
import AuthForm from '@/components/forms/AuthForm.vue';
const route = useRoute();
const router = useRouter();
// Props
const props = defineProps({
  defaultView: {
    type: String,
    default: 'login',
    validator: (value) => ['login', 'register', 'reset', 'auth'].includes(value)
  }
});

const currentView = ref(props.defaultView);

const getTitle = () => {
  switch (currentView.value) {
    case 'login':
      return 'Welcome Back';
    case 'register':
      return 'Create Account';
    case 'reset':
      return 'Reset Password';
    case 'auth':
      return 'Sign In to PeerSwap';
    default:
      return 'Authentication';
  }
};

const getSubtitle = () => {
  switch (currentView.value) {
    case 'login':
      return 'Sign in to your PeerSwap account';
    case 'register':
      return 'Join the PeerSwap community';
    case 'reset':
      return 'Enter your email to reset your password';
    case 'auth':
      return 'Connect with fellow students';
    default:
      return '';
  }
};

const handleAuthSuccess = (user) => {
  console.log('Authentication successful:', user);
  // Redirect based on route query or default to dashboard
  const redirectTo = route.query.redirect || '/dashboard';
  router.push(redirectTo);
};

// Set initial view based on route params
onMounted(() => {
  const viewParam = route.params.view || route.query.view;
  if (viewParam && ['login', 'register', 'reset', 'auth'].includes(viewParam)) {
    currentView.value = viewParam;
  }
});
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
.auth-form-enter-active,
.auth-form-leave-active {
  transition: all 0.3s ease;
}

.auth-form-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
.auth-form-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>