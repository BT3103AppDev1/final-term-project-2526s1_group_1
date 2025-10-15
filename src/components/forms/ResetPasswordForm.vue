<template>
  <form id="authForm" class="space-y-4">
    <div class="label-input-div">
      <label for="auth-email-input" class="block text-sm font-medium text-orange-600 mb-1">
        Email Address
      </label>
      <input 
        type="email" 
        v-model="emailAddress" 
        id="auth-email-input" 
        placeholder="Enter your email address"
        class="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        required
      >
    </div>

    <button 
      class="reset-button" 
      v-show="state === 'Verify'" 
      type="button" 
      :disabled="!emailAddress || loading" 
      @click.prevent="resetPasswordRequest"
    >
      <span v-if="loading">Sending...</span>
      <span v-else>Send Reset Link</span>
    </button>

    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { auth } from '@/firebase/config';
import { sendPasswordResetEmail } from "firebase/auth";

// Reactive data
const emailAddress = ref('');
const state = ref('Verify');
const loading = ref(false);
const message = ref('');
const messageType = ref('');

// Emits
const emit = defineEmits(['changeStateToLogin']);

// Methods
const resetPasswordRequest = async () => {
  if (!emailAddress.value) {
    showMessage('Please enter your email address', 'error');
    return;
  }

  loading.value = true;
  message.value = '';

  try {
    await sendPasswordResetEmail(auth, emailAddress.value);
    showMessage('Password reset email sent! Please check your inbox.', 'success');
    
    // Wait a moment then emit to parent to change state
    setTimeout(() => {
      emit('changeStateToLogin');
    }, 2000);
    
  } catch (error) {
    console.error('Password reset error:', error);
    
    let errorMessage = 'Failed to send reset email. ';
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage += 'No account found with this email address.';
        break;
      case 'auth/invalid-email':
        errorMessage += 'Please enter a valid email address.';
        break;
      case 'auth/too-many-requests':
        errorMessage += 'Too many requests. Please try again later.';
        break;
      default:
        errorMessage += 'Please try again.';
    }
    
    showMessage(errorMessage, 'error');
  } finally {
    loading.value = false;
  }
};

const showMessage = (text, type) => {
  message.value = text;
  messageType.value = type;
  
  // Clear message after 5 seconds
  setTimeout(() => {
    message.value = '';
    messageType.value = '';
  }, 5000);
};
</script>

<style scoped>
#authForm {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: transparent;
  width: 100%;
  max-width: 350px;
}

.label-input-div {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 1rem;
  width: 100%;
}

.label-input-div input {
  width: 100%;
  height: 40px;
  border: 1px solid #f59e0b;
  border-radius: 6px;
  background-color: white;
  padding: 0 12px;
  font-size: 14px;
  transition: all 0.2s;
}

.label-input-div input:focus {
  outline: none;
  border-color: #d97706;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.label-input-div label {
  font-size: 14px;
  color: #f59e0b;
  font-weight: 500;
  margin-bottom: 4px;
}

.reset-button {
  outline: none;
  border: none;
  background-color: #f59e0b;
  color: white;
  font-size: 14px;
  font-weight: 500;
  height: 40px;
  width: 100%;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reset-button:hover:not(:disabled) {
  background-color: #d97706;
}

.reset-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.message {
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
  width: 100%;
  margin-top: 1rem;
}

.message.success {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.message.error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}
</style>
