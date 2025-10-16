<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Enhanced Header -->
    <header class="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <Button variant="ghost" size="sm" as-child class="hover:bg-slate-100 transition-colors">
              <router-link to="/browse" class="flex items-center gap-2">
                <ArrowLeft class="h-4 w-4" />
                <span class="hidden sm:inline">Back to Browse</span>
              </router-link>
            </Button>
            <div class="flex items-center gap-3">
              <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <span class="text-white font-bold text-sm">PS</span>
              </div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PeerSwap</h1>
            </div>
          </div>
          <Button variant="outline" size="sm" as-child class="flex items-center gap-2">
            <router-link to="/profile">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span class="hidden sm:inline">Profile</span>
            </router-link>
          </Button>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-12">
      <div class="flex flex-col items-center justify-center min-h-[400px]">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-slate-600 text-lg">Loading item details...</p>
      </div>
    </div>

    <!-- Item Detail Content -->
    <div v-else-if="item" class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Image Gallery -->
          <Card class="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardContent class="p-0">
              <div class="relative group">
                <img
                  :src="item.images[selectedImageIndex]"
                  :alt="item.title"
                  class="w-full h-96 sm:h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <!-- Save Button -->
                <Button
                  size="sm"
                  class="absolute top-4 right-4 bg-white/90 backdrop-blur-md hover:bg-white shadow-lg border-0"
                  @click="toggleSave"
                >
                  <Heart :class="['h-4 w-4 mr-2', { 'fill-red-500 text-red-500': isSaved }]" />
                  {{ isSaved ? 'Saved' : 'Save' }}
                </Button>
              </div>
              
              <!-- Thumbnail Gallery -->
              <div class="p-6">
                <div class="flex gap-3 overflow-x-auto">
                  <img
                    v-for="(image, index) in item.images"
                    :key="index"
                    :src="image"
                    :alt="`${item.title} ${index + 1}`"
                    class="w-20 h-16 object-cover rounded-lg cursor-pointer transition-all"
                    :class="selectedImageIndex === index ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'"
                    @click="selectedImageIndex = index"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Item Details -->
          <Card class="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div class="flex items-start justify-between gap-4">
                <div>
                  <CardTitle class="text-3xl font-bold text-slate-900 mb-4">{{ item.title }}</CardTitle>
                  <div class="flex items-center gap-4 text-sm">
                    <div class="flex items-center gap-2">
                      <Clock class="h-4 w-4 text-blue-600" />
                      <span>Posted {{ item.postedAt }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <MapPin class="h-4 w-4 text-green-600" />
                      <span>{{ item.location }}</span>
                    </div>
                  </div>
                </div>
                <Badge class="bg-blue-100 text-blue-800">{{ item.category }}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p class="text-slate-700 leading-relaxed mb-6">{{ item.description }}</p>
              
              <div class="space-y-6">
                <div>
                  <h3 class="font-semibold mb-4">Specifications</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div
                      v-for="[key, value] in Object.entries(item.specifications)"
                      :key="key"
                      class="flex justify-between"
                    >
                      <span class="text-slate-600">{{ key }}:</span>
                      <span class="font-medium">{{ value }}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 class="font-semibold mb-4">Rental Terms</h3>
                  <ul class="space-y-2">
                    <li
                      v-for="(term, index) in item.rentalTerms"
                      :key="index"
                      class="flex items-start gap-2 text-sm"
                    >
                      <div class="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span>{{ term }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Rental Card -->
          <Card class="border-0 shadow-xl bg-white/80 backdrop-blur-sm sticky top-24">
            <CardHeader class="text-center">
              <div class="text-4xl font-bold text-blue-600 mb-2">
                ${{ item.price }}
                <span class="text-lg font-normal text-slate-600">/{{ item.period }}</span>
              </div>
              <Badge class="bg-green-100 text-green-800">{{ item.condition }} Condition</Badge>
            </CardHeader>
            <CardContent class="space-y-4">
              <Button
                class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
                :disabled="!item.available"
                @click="requestRental"
              >
                {{ item.available ? 'Request Rental' : 'Not Available' }}
              </Button>
              
              <Button variant="outline" class="w-full" size="lg" @click="sendMessage">
                <MessageCircle class="h-5 w-5 mr-2" />
                Message Owner
              </Button>
            </CardContent>
          </Card>

          <!-- Owner Card -->
          <Card class="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Item Owner</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex items-center gap-3 mb-4">
                <Avatar class="h-12 w-12">
                  <AvatarImage :src="item.owner.avatar" />
                  <AvatarFallback>{{ getInitials(item.owner.name) }}</AvatarFallback>
                </Avatar>
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-semibold">{{ item.owner.name }}</h4>
                    <Badge v-if="item.owner.verified" class="bg-green-100 text-green-800 text-xs">
                      <Shield class="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <div class="flex items-center gap-1 text-sm text-slate-600">
                    <Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{{ item.owner.rating }} ({{ item.owner.reviewCount }} reviews)</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" class="w-full" size="sm">
                View Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- Item Not Found -->
    <div v-else class="container mx-auto px-4 py-12">
      <div class="text-center">
        <h3 class="text-xl font-semibold mb-3">Item Not Found</h3>
        <p class="text-slate-600 mb-6">The item you're looking for doesn't exist.</p>
        <Button as-child>
          <router-link to="/browse">Back to Browse</router-link>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  MapPin,
  Star,
  Clock,
  Heart,
  MessageCircle,
  Shield,
  ArrowLeft
} from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar.vue'

const route = useRoute()
const router = useRouter()

// State
const item = ref(null)
const loading = ref(true)
const selectedImageIndex = ref(0)
const isSaved = ref(false)

// Mock item data
const mockItem = {
  id: "1",
  title: "Calculus Textbook - 8th Edition",
  description: "Stewart Calculus textbook in excellent condition. Perfect for Calculus I and II courses.",
  price: 15,
  period: "week",
  category: "Textbooks",
  condition: "Excellent",
  location: "Campus North",
  postedAt: "2 days ago",
  available: true,
  images: [
    "/calculus-textbook-front-cover.jpg",
    "/placeholder.svg?key=calc-2",
    "/placeholder.svg?key=calc-3"
  ],
  specifications: {
    "Edition": "8th Edition",
    "Author": "James Stewart",
    "ISBN": "978-1305266636",
    "Pages": "1344"
  },
  rentalTerms: [
    "Textbook must be returned in the same condition",
    "No writing or highlighting allowed",
    "Late return fee of $5 per day"
  ],
  owner: {
    name: "Sarah Chen",
    avatar: "/placeholder.svg?key=sarah",
    rating: 4.9,
    reviewCount: 23,
    verified: true
  }
}

// Methods
const getInitials = (name) => {
  return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'
}

const toggleSave = () => {
  isSaved.value = !isSaved.value
}

const requestRental = () => {
  console.log('Requesting rental for:', item.value.title)
}

const sendMessage = () => {
  router.push('/messages')
}

// Load item data
onMounted(() => {
  setTimeout(() => {
    item.value = mockItem
    loading.value = false
  }, 500)
})
</script>