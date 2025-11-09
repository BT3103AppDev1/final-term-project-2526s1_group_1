<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="container mx-auto px-4 py-12 lg:py-20">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left Content -->
          <div class="lg:pr-8">
            <!-- Logo -->
            <div class="flex items-center gap-3 mb-8">
              <div class="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg">
                <span class="text-white font-bold text-2xl">PS</span>
              </div>
              <h1 class="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                PeerSwap
              </h1>
            </div>

            <!-- Headline -->
            <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Share, Rent, and Connect with Fellow Students
            </h2>
            
            <p class="text-lg text-gray-600 mb-8 leading-relaxed">
              Join the student community where you can rent textbooks, electronics, and equipment from your peers. 
              Save money, reduce waste, and build connections.
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 mb-8">
              <router-link 
                to="/auth/register"
                class="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Get Started Free
                <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </router-link>
              
              <router-link 
                to="/auth/login"
                class="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 shadow-lg"
              >
                Sign In
              </router-link>
            </div>
          </div>

          <!-- Right Visual Content -->
          <div class="relative lg:pl-8">
            <div class="relative">
              <!-- Main Card Image -->
              <div class="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div class="space-y-6">
                  <!-- Header -->
                  <div class="flex items-center justify-between">
                    <h3 class="font-bold text-gray-900">Available Items</h3>
                    <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">3 nearby</span>
                  </div>
                  
                  <!-- Sample Items -->
                  <div class="space-y-4">
                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                        </svg>
                      </div>
                      <div class="flex-1">
                        <p class="font-medium text-gray-900">Calculus Textbook</p>
                        <p class="text-sm text-gray-500">$15/week</p>
                      </div>
                    </div>
                    
                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                      </div>
                      <div class="flex-1">
                        <p class="font-medium text-gray-900">MacBook Pro</p>
                        <p class="text-sm text-gray-500">$50/week</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Floating Elements -->
              <div class="absolute -top-4 -right-4 w-20 h-20 bg-orange-200 rounded-full opacity-50 animate-pulse"></div>
              <div class="absolute -bottom-6 -left-4 w-16 h-16 bg-amber-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Why Choose PeerSwap?</h3>
          <p class="text-gray-600 max-w-2xl mx-auto">
            We make it easy and safe for students to share resources and build community connections.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <!-- Feature 1 -->
          <div class="text-center p-4 lg:p-6 group hover:bg-orange-50 rounded-2xl transition-colors duration-200">
            <div class="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-orange-100 rounded-2xl mb-4 group-hover:bg-orange-200 transition-colors duration-200">
              <svg class="w-6 h-6 lg:w-8 lg:h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <h4 class="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Save Money</h4>
            <p class="text-sm lg:text-base text-gray-600">
              Rent textbooks and equipment at fraction of retail prices from fellow students.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center p-4 lg:p-6 group hover:bg-orange-50 rounded-2xl transition-colors duration-200">
            <div class="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-orange-100 rounded-2xl mb-4 group-hover:bg-orange-200 transition-colors duration-200">
              <svg class="w-6 h-6 lg:w-8 lg:h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h4 class="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Build Community</h4>
            <p class="text-sm lg:text-base text-gray-600">
              Connect with students in your area and build lasting friendships through sharing.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center p-4 lg:p-6 group hover:bg-orange-50 rounded-2xl transition-colors duration-200 sm:col-span-2 lg:col-span-1">
            <div class="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-orange-100 rounded-2xl mb-4 group-hover:bg-orange-200 transition-colors duration-200">
              <svg class="w-6 h-6 lg:w-8 lg:h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h4 class="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Safe & Secure</h4>
            <p class="text-sm lg:text-base text-gray-600">
              Student-verified accounts and secure messaging ensure safe transactions.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works Section -->
    <section class="py-12 lg:py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-10">
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Getting started with PeerSwap is simple and straightforward.
          </p>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 max-w-4xl mx-auto">
          <!-- Step 1 -->
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-orange-500 text-white rounded-full mb-3 lg:mb-4 font-bold text-sm lg:text-base">
              1
            </div>
            <h4 class="font-semibold text-gray-900 mb-2 text-sm lg:text-base">Sign Up</h4>
            <p class="text-gray-600 text-xs lg:text-sm">Create your account with your student email</p>
          </div>

          <!-- Step 2 -->
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-orange-500 text-white rounded-full mb-3 lg:mb-4 font-bold text-sm lg:text-base">
              2
            </div>
            <h4 class="font-semibold text-gray-900 mb-2 text-sm lg:text-base">Browse</h4>
            <p class="text-gray-600 text-xs lg:text-sm">Find items you need or list items to rent out</p>
          </div>

          <!-- Step 3 -->
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-orange-500 text-white rounded-full mb-3 lg:mb-4 font-bold text-sm lg:text-base">
              3
            </div>
            <h4 class="font-semibold text-gray-900 mb-2 text-sm lg:text-base">Connect</h4>
            <p class="text-gray-600 text-xs lg:text-sm">Message the owner and arrange pickup details</p>
          </div>

          <!-- Step 4 -->
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-orange-500 text-white rounded-full mb-3 lg:mb-4 font-bold text-sm lg:text-base">
              4
            </div>
            <h4 class="font-semibold text-gray-900 mb-2 text-sm lg:text-base">Enjoy</h4>
            <p class="text-gray-600 text-xs lg:text-sm">Use the item and return it safely</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-12 lg:py-16 bg-gradient-to-r from-orange-500 to-amber-500">
      <div class="container mx-auto px-4 text-center">
        <h3 class="text-2xl lg:text-3xl font-bold text-white mb-4">
          Ready to Start Sharing?
        </h3>
        <p class="text-orange-100 mb-6 lg:mb-8 max-w-2xl mx-auto text-sm lg:text-base">
          Join thousands of students who are already saving money and building community through PeerSwap.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
          <router-link 
            to="/auth/register"
            class="inline-flex items-center justify-center px-6 lg:px-8 py-3 lg:py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg text-sm lg:text-base"
          >
            Create Account
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-300 py-12">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
                <span class="text-white font-bold text-sm">PS</span>
              </div>
              <span class="text-xl font-bold text-white">PeerSwap</span>
            </div>
            <p class="text-gray-400 text-sm">
              The student community platform for sharing and renting educational resources.
            </p>
          </div>
          
          <div>
            <h5 class="font-semibold text-white mb-4">Platform</h5>
            <ul class="space-y-2 text-sm">
              <li><router-link to="/auth/register" class="hover:text-orange-400">Sign Up</router-link></li>
              <li><router-link to="/auth/login" class="hover:text-orange-400">Sign In</router-link></li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 PeerSwap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// This is a landing page component
</script>

<style scoped>
/* Additional custom styles if needed */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>
