<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
          <Card class="border-0 shadow-xl bg-white/80 backdrop-blur-sm top-24">
            <CardHeader class="text-center">
              <div class="text-4xl font-bold text-blue-600 mb-2">
                ${{ item.price }}
                <span class="text-lg font-normal text-slate-600">/{{ item.period }}</span>
              </div>
              <div class="flex gap-2 justify-center">
                <Badge class="bg-green-100 text-green-800">{{ item.condition }} Condition</Badge>
                <Badge 
                  :class="[
                    item.available && item.status !== 'Rented'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ item.available && item.status !== 'Rented' ? 'Available' : 'Rented' }}
                </Badge>
              </div>
            </CardHeader>
            <CardContent class="space-y-4">
              <Button
                class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
                :disabled="!item.available || item.status === 'Rented'"
                @click="requestRental"
              >
                {{ item.available && item.status !== 'Rented' ? 'Request Rental' : 'Not Available' }}
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
              <Button variant="outline" class="w-full" size="sm" @click="router.push(`/profile/${item.owner.id}`)">
                View Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-12">
      <div class="text-center">
        <div class="text-6xl mb-4">😞</div>
        <h3 class="text-xl font-semibold mb-3">{{ error }}</h3>
        <p class="text-slate-600 mb-6">
          {{ error === 'Item not found' ? 
            "The item you're looking for doesn't exist or may have been removed." :
            "We're having trouble loading this item. Please try again." 
          }}
        </p>
        <div class="flex gap-3 justify-center">
          <Button as-child variant="outline">
            <router-link to="/browse">Back to Browse</router-link>
          </Button>
          <Button @click="fetchItemData(route.params.id)" v-if="error !== 'Item not found'">
            Try Again
          </Button>
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
import { doc, getDoc } from 'firebase/firestore'
import { db, auth } from '@/firebase.js'
import { useMessages } from '@/composables/useMessages.js'
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
const { createConversation, loading: messagesLoading } = useMessages()

// State
const item = ref(null)
const loading = ref(true)
const selectedImageIndex = ref(0)
const isSaved = ref(false)
const error = ref(null)

// Methods
const getInitials = (name) => {
  return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'
}

const toggleSave = () => {
  isSaved.value = !isSaved.value
}

const requestRental = () => {
  console.log('Requesting rental for:', item.value.title)
  router.push(`/request-rental/${item.value.id}`)
}

const sendMessage = async () => {
  // Check if user is logged in
  if (!auth.currentUser) {
    alert('Please log in to message the owner')
    router.push('/login')
    return
  }

  // Check if user is trying to message themselves
  if (auth.currentUser.uid === item.value.owner.id) {
    alert('You cannot message yourself!')
    return
  }

  try {
    // Create or find existing conversation
    const conversationId = await createConversation(
      item.value.owner.id,
      item.value.id,
      item.value.title
    )

    // Show success message
    alert(`Conversation started! You can now message ${item.value.owner.name} about "${item.value.title}".`)
    
    // Redirect to messages page
    router.push('/messages')
  } catch (error) {
    console.error('Error creating conversation:', error)
    alert('Failed to start conversation. Please try again.')
  }
}

// Fetch item data from Firebase
const fetchItemData = async (itemId) => {
  try {
    loading.value = true
    error.value = null
    
    console.log('Fetching item with ID:', itemId)
    
    // Fetch item from Firebase
    const itemDoc = doc(db, 'listings', itemId)
    const itemSnap = await getDoc(itemDoc)
    
    if (itemSnap.exists()) {
      const itemData = itemSnap.data()
      console.log('Item data from Firebase:', itemData)
      
      // Transform Firebase data to match component expectations
      item.value = {
        id: itemSnap.id,
        title: itemData.title || itemData.name,
        description: itemData.description || 'No description available',
        price: itemData.price || 0,
        period: itemData.period || itemData.pricePer || 'day',
        category: itemData.category || 'Other',
        condition: itemData.condition || 'Good',
        location: itemData.location || 'Location not specified',
        postedAt: itemData.createdAt ? 
          new Date(itemData.createdAt.seconds * 1000).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }) : 'Recently posted',
        available: itemData.status === 'active' || itemData.available !== false,
        images: itemData.images && itemData.images.length > 0 ? itemData.images : ['/placeholder.jpg'],
        specifications: itemData.specifications || {},
        rentalTerms: itemData.rentalTerms || [
          'Item must be returned in the same condition',
          'No damage or misuse allowed',
          'Late return fees may apply'
        ],
        owner: {
          id: itemData.ownerId,
          name: itemData.ownerName || 'Anonymous User',
          avatar: itemData.ownerAvatar || '/placeholder-user.jpg',
          rating: itemData.ownerRating || 'no ratings record',
          reviewCount: itemData.ownerReviewCount || 0,
          verified: itemData.ownerVerified || false
        }
      }
    } else {
      error.value = 'Item not found'
      console.log('No item found with ID:', itemId)
    }
  } catch (err) {
    console.error('Error fetching item:', err)
    error.value = 'Failed to load item details'
  } finally {
    loading.value = false
  }
}

// Load item data based on route parameter
onMounted(() => {
  const itemId = route.params.id
  console.log('ItemDetailPage mounted with ID:', itemId)
  
  if (itemId) {
    fetchItemData(itemId)
  } else {
    error.value = 'No item ID provided'
    loading.value = false
  }
})
</script>