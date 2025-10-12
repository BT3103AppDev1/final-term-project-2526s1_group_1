<template>
    <div class="min-h-screen bg-background w-full overflow-x-hidden">
        <!-- Nav top tab-->
        <nav class="sticky top-0 z-50 w-full bg-slate-100 border-b border-border">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <div class="flex items-center justify-between">
                    <!--Logo-->
                    <router-link to="/" class="flex items-center gap-2">
                        <div class="h-10 w-10 rounded-lg bg-green-700 flex items-center justify-center">
                            <span class="text-white font-bold text-lg">PS</span>
                        </div>
                        <h1 class="text-2xl font-bold text-gray-900">PeerSwap</h1>
                    </router-link>
                    <!--Nav but -->
                    <div class="flex items-center gap-3">
                        <Button variant="outline" as-child>
                            <router-link to="/login">Log In</router-link>
                        </Button>
                        <Button variant="custom" size="lg" class="bg-orange-500 hover:bg-orange-700" as-child>
                            <router-link to="/login">Get Started</router-link>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Rent&Lend header Section -->
        <section class="w-full py-4 md:py-8">
            <div class="max-w-7xl mx-auto px-2">
                <div class="bg-teal-50 rounded-3xl p-8 md:p-12 lg:p-16 text-center">
                    <!-- Main Headline -->
                    <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Rent & Lend with Your<br />
                        <span class="text-blue-900">NUS Community</span>
                    </h2>
                    <p class="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        The trusted platform for NUS students to share resources, save money, and build connections through peer-to-peer transactions.
                    </p>
                    
                    <!--Buttons -->
                    <div class="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                        <Button variant="custom" size="lg" class="bg-orange-500 hover:bg-orange-700 text-lg px-8 py-6 w-full sm:w-auto" as-child>
                            <router-link to="/login">Start Renting Today</router-link>
                        </Button>
                        <Button variant="outline" size="lg" class="text-lg px-8 py-6 border-2 w-full sm:w-auto" @click="scrollToProcess">
                            Learn More
                        </Button>
                    </div>
                    
                    <!-- Verification Note -->
                    <p class="text-sm text-gray-500">Requires valid NUS email for verification</p>
                </div>
            </div>
        </section>

        <!-- Process -->
        <section ref="processSection" class="w-full py-2 md:py-4">
            <div class="max-w-7xl mx-auto px-5">
                <h3 class="text-3xl md:text-4xl font-bold text-center mb-16">
                    Get started in minutes with our simple process
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
                    <!-- Step 1 -->
                    <div class="text-center">
                        <div class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-6">
                            <span class="text-white text-3xl md:text-4xl font-bold">1</span>
                        </div>
                        <h4 class="text-xl font-semibold">Sign Up with NUS Email</h4>
                    </div>
                    <!-- Step 2 -->
                    <div class="text-center">
                        <div class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-orange-600 flex items-center justify-center mx-auto mb-6">
                            <span class="text-white text-3xl md:text-4xl font-bold">2</span>
                        </div>
                        <h4 class="text-xl font-semibold">List or Browse Items</h4>
                    </div>
                    <!-- Step 3 -->
                    <div class="text-center">
                        <div class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-green-700 flex items-center justify-center mx-auto mb-6">
                            <span class="text-white text-3xl md:text-4xl font-bold">3</span>
                        </div>
                        <h4 class="text-xl font-semibold">Connect & Rent/Buy</h4>
                    </div>
                </div>
            </div>
        </section>
        <!-- Footer -->
        <footer class="w-full border-t border-border py-4 mt-16">
            <div class="max-w-7xl mx-auto px-4 text-center text-gray-600">
                <p>&copy; 2025 PeerSwap. Student-to-Student Rental Platform</p>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@/components/ui/button.vue'

const processSection = ref(null)

const scrollToProcess = () => {
    processSection.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>