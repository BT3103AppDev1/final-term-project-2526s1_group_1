<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Enhanced Header -->
    <header class="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <Button variant="ghost" size="sm" as-child class="hover:bg-slate-100 transition-colors">
            <router-link to="/browse" class="flex items-center gap-2">
              <ArrowLeft class="h-4 w-4" />
              <span class="hidden sm:inline">Back to Browse</span>
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

    <!-- Enhanced Item Detail Content -->
    <div v-else-if="item" class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Enhanced Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Enhanced Image Gallery -->
          <Card class="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50 opacity-30"></div>
            <CardContent class="p-0 relative">
              <div class="relative group">
                <img
                  :src="item.images[selectedImageIndex]"
                  :alt="item.name"
                  class="w-full h-96 sm:h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <!-- Enhanced Save Button -->
                <Button
                  size="sm"
                  class="absolute top-4 right-4 bg-white/90 backdrop-blur-md hover:bg-white shadow-lg border-0 transition-all duration-200 hover:scale-105"
                  @click="toggleSave"
                >
                  <Heart :class="['h-4 w-4 mr-2 transition-colors', { 'fill-red-500 text-red-500': isSaved, 'text-slate-600': !isSaved }]" />
                  <span class="text-slate-700 font-medium">{{ isSaved ? 'Saved' : 'Save' }}</span>
                </Button>
                
                <!-- Image Navigation -->
                <div v-if="item.images.length > 1" class="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="sm" 
                    class="bg-white/90 backdrop-blur-md shadow-lg border-0 rounded-full h-10 w-10 p-0"
                    @click="previousImage"
                  >
                    <ArrowLeft class="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    class="bg-white/90 backdrop-blur-md shadow-lg border-0 rounded-full h-10 w-10 p-0"
                    @click="nextImage"
                  >
                    <ArrowRight class="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <!-- Enhanced Thumbnail Gallery -->
              <div class="p-6">
                <div class="flex gap-3 overflow-x-auto scrollbar-hide">
                  <img
                    v-for="(image, index) in item.images"
                    :key="index"
                    :src="image"
                    :alt="`${item.name} ${index + 1}`"
                    class="w-20 h-16 sm:w-24 sm:h-18 object-cover rounded-lg cursor-pointer transition-all duration-200 flex-shrink-0"
                    :class="selectedImageIndex === index 
                      ? 'ring-2 ring-blue-500 shadow-lg scale-105' 
                      : 'ring-1 ring-slate-200 hover:ring-blue-300 hover:scale-105 hover:shadow-md'"
                    @click="selectedImageIndex = index"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Enhanced Item Details -->
          <Card class="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-slate-50 to-green-50 opacity-30"></div>
            <CardHeader class="relative">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <CardTitle class="text-3xl font-bold text-slate-900 mb-4">{{ item.name }}</CardTitle>
                  <div class="flex flex-wrap items-center gap-4 text-sm">
                    <div class="flex items-center gap-2 bg-white/60 rounded-lg px-3 py-2">
                      <Clock class="h-4 w-4 text-blue-600" />
                      <span class="text-slate-700 font-medium">Posted {{ item.postedAt }}</span>
                    </div>
                    <div class="flex items-center gap-2 bg-white/60 rounded-lg px-3 py-2">
                      <MapPin class="h-4 w-4 text-green-600" />
                      <span class="text-slate-700 font-medium">{{ item.location }}</span>
                    </div>
                    <div class="flex items-center gap-2 bg-white/60 rounded-lg px-3 py-2">
                      <Eye class="h-4 w-4 text-purple-600" />
                      <span class="text-slate-700 font-medium">{{ item.views || 0 }} views</span>
                    </div>
                  </div>
                </div>
                <Badge class="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200 px-3 py-1">
                  {{ item.category }}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent class="relative">
              <div class="bg-white/60 rounded-xl p-6 mb-6">
                <h3 class="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <div class="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <svg class="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  Description
                </h3>
                <p class="text-slate-700 leading-relaxed">{{ item.description }}</p>
              </div>

              <div class="bg-white/60 rounded-xl p-6 mb-6">
                <h3 class="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <div class="h-6 w-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <svg class="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                  </div>
                  Specifications
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    v-for="[key, value] in Object.entries(item.specifications)"
                    :key="key"
                    class="flex justify-between items-center bg-white/40 rounded-lg px-4 py-3"
                  >
                    <span class="text-slate-600 font-medium">{{ key }}:</span>
                    <span class="font-semibold text-slate-900">{{ value }}</span>
                  </div>
                </div>
              </div>

              <div class="bg-white/60 rounded-xl p-6">
                <h3 class="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <div class="h-6 w-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <svg class="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  Rental Terms
                </h3>
                <ul class="space-y-3">
                  <li
                    v-for="(term, index) in item.rentalTerms"
                    :key="index"
                    class="flex items-start gap-3 bg-white/40 rounded-lg px-4 py-3"
                  >
                    <div class="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mt-2 shrink-0" />
                    <span class="text-slate-700 leading-relaxed">{{ term }}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Enhanced Sidebar -->
        <div class="space-y-6">
          <!-- Enhanced Rental Card -->
          <Card class="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden sticky top-24">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"></div>
            <CardHeader class="relative text-center">
              <div class="bg-white/60 rounded-2xl p-6 mb-4">
                <div class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  ${{ item.price }}
                  <span class="text-lg font-normal text-slate-600">/{{ item.pricePer }}</span>
                </div>
                <Badge 
                  :class="item.condition === 'Excellent' 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : 'bg-amber-100 text-amber-800 border-amber-200'"
                  class="px-3 py-1"
                >
                  {{ item.condition }} Condition
                </Badge>
              </div>
              
              <!-- Availability Status -->
              <div class="flex items-center justify-center gap-2 mb-4">
                <div :class="item.available ? 'bg-green-500' : 'bg-red-500'" class="h-3 w-3 rounded-full shadow-sm"></div>
                <span :class="item.available ? 'text-green-700' : 'text-red-700'" class="font-semibold">
                  {{ item.available ? 'Available Now' : 'Currently Unavailable' }}
                </span>
              </div>
            </CardHeader>
            
            <CardContent class="space-y-4 relative">
              <Button
                class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                size="lg"
                :disabled="!item.available"
                @click="requestRental"
              >
                <Calendar class="h-5 w-5 mr-2" />
                {{ item.available ? 'Request Rental' : 'Not Available' }}
              </Button>
              
              <Button
                variant="outline"
                class="w-full border-slate-300 hover:bg-slate-50"
                size="lg"
                @click="sendMessage"
              >
                <MessageCircle class="h-5 w-5 mr-2" />
                Message Owner
              </Button>
              
              <!-- Quick Info -->
              <div class="bg-white/60 rounded-xl p-4 space-y-3">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-600">Minimum rental</span>
                  <span class="font-semibold text-slate-900">1 {{ item.pricePer }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-600">Response time</span>
                  <span class="font-semibold text-slate-900">Usually within 2 hours</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-600">Pickup location</span>
                  <span class="font-semibold text-slate-900">{{ item.location }}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Enhanced Owner Card -->
          <Card class="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-50"></div>
            <CardHeader class="relative">
              <CardTitle class="flex items-center gap-2 text-slate-900">
                <div class="h-6 w-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <svg class="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                Meet the Owner
              </CardTitle>
            </CardHeader>
            <CardContent class="relative">
              <div class="flex items-center gap-4 mb-4">
                <Avatar class="h-16 w-16 ring-2 ring-white shadow-lg">
                  <AvatarImage :src="item.owner.avatar" />
                  <AvatarFallback class="bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold text-lg">
                    {{ getInitials(item.owner.name) }}
                  </AvatarFallback>
                </Avatar>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-bold text-slate-900">{{ item.owner.name }}</h3>
                    <Badge v-if="item.owner.verified" class="bg-green-100 text-green-800 border-green-200 text-xs">
                      <Shield class="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <div class="flex items-center gap-2 mb-2">
                    <div class="flex items-center">
                      <Star v-for="i in 5" :key="i" 
                           :class="i <= Math.floor(item.owner.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'"
                           class="h-4 w-4" />
                    </div>
                    <span class="text-sm text-slate-600">({{ item.owner.reviewCount }} reviews)</span>
                  </div>
                  <p class="text-sm text-slate-600">Member since {{ item.owner.joinedDate }}</p>
                </div>
              </div>
              
              <div class="bg-white/60 rounded-xl p-4 space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-slate-600">Response rate</span>
                  <span class="font-semibold text-green-600">98%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-600">Items listed</span>
                  <span class="font-semibold text-slate-900">{{ item.owner.itemsCount || 12 }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-600">Total rentals</span>
                  <span class="font-semibold text-slate-900">{{ item.owner.rentalsCount || 47 }}</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                class="w-full mt-4 border-green-300 hover:bg-green-50 hover:border-green-400 text-green-700"
                @click="viewOwnerProfile"
              >
                View Profile
              </Button>
            </CardContent>
          </Card>

          <!-- Enhanced Safety Tips -->
          <Card class="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-50"></div>
            <CardHeader class="relative">
              <CardTitle class="flex items-center gap-2 text-slate-900">
                <div class="h-6 w-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Shield class="h-3 w-3 text-white" />
                </div>
                Safety Tips
              </CardTitle>
            </CardHeader>
            <CardContent class="relative">
              <ul class="space-y-3 text-sm">
                <li class="flex items-start gap-3">
                  <div class="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span class="text-slate-700">Always meet in public places for item exchange</span>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span class="text-slate-700">Inspect the item thoroughly before payment</span>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span class="text-slate-700">Use PeerSwap's secure payment system</span>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span class="text-slate-700">Report any suspicious activity immediately</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !item" class="container mx-auto px-4 py-12">
      <div class="flex flex-col items-center justify-center min-h-[400px]">
        <div class="text-6xl mb-4">😕</div>
        <h2 class="text-2xl font-bold text-slate-900 mb-2">{{ error || 'Item Not Found' }}</h2>
        <p class="text-slate-600 mb-6">The item you're looking for doesn't exist or has been removed.</p>
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
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase.js'
import {
  MapPin,
  Star,
  Clock,
  Heart,
  MessageCircle,
  Shield,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Eye
} from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card.vue'
import { Badge } from '@/components/ui/Badge.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar.vue'

const route = useRoute()
const router = useRouter()

// State
const loading = ref(true)
const selectedImageIndex = ref(0)
const isSaved = ref(false)
const item = ref(null)
const error = ref(null)
// Methods
const fetchItem = async (itemId) => {
  try {
    loading.value = true
    error.value = null
    
    const itemDoc = doc(db, 'listings', itemId)
    const itemSnap = await getDoc(itemDoc)
    
    if (itemSnap.exists()) {
      const itemData = itemSnap.data()
      item.value = {
        id: itemSnap.id,
        name: itemData.name,
        description: itemData.description,
        price: itemData.price,
        pricePer: itemData.pricePer || 'day',
        category: itemData.category,
        condition: itemData.condition,
        location: itemData.location,
        images: itemData.images || [],
        available: itemData.status === 'Available',
        createdAt: itemData.createdAt,
        ownerId: itemData.ownerId,
        // Convert Firebase timestamp to readable format
        postedAt: itemData.createdAt ? new Date(itemData.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown',
        views: itemData.views || 0,
        specifications: itemData.specifications || {},
        rentalTerms: itemData.rentalTerms || [],
        owner: {
          name: itemData.ownerName || 'Unknown',
          avatar: "/placeholder.svg?key=owner",
          rating: 4.8,
          reviewCount: 15,
          verified: true,
          joinedDate: "2023",
          itemsCount: 5,
          rentalsCount: 20
        }
      }
    } else {
      error.value = 'Item not found'
      item.value = null
    }
  } catch (err) {
    console.error('Error fetching item:', err)
    error.value = 'Failed to load item details'
    item.value = null
  } finally {
    loading.value = false
  }
}

const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

const toggleSave = () => {
  isSaved.value = !isSaved.value
  // TODO: Implement save to favorites in Firebase
}

const previousImage = () => {
  if (selectedImageIndex.value > 0) {
    selectedImageIndex.value--
  } else {
    selectedImageIndex.value = item.value.images.length - 1
  }
}

const nextImage = () => {
  if (selectedImageIndex.value < item.value.images.length - 1) {
    selectedImageIndex.value++
  } else {
    selectedImageIndex.value = 0
  }
}

const requestRental = () => {
  // TODO: Implement rental request functionality
  console.log('Requesting rental for:', item.value.name)
}

const sendMessage = () => {
  router.push('/messages')
}

const viewOwnerProfile = () => {
  router.push(`/profile/${item.value.owner.id}`)
}

// Load item data based on route params
onMounted(() => {
  const itemId = route.params.id
  if (itemId) {
    fetchItem(itemId)
  } else {
    error.value = 'No item ID provided'
    loading.value = false
  }
})
</script>