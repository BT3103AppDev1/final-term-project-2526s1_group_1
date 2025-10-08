<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <Button variant="ghost" size="sm" as-child>
              <router-link to="/browse">
                <ArrowLeft class="h-4 w-4 mr-2" />
                Back to Browse
              </router-link>
            </Button>
            <div class="flex items-center gap-2">
              <div class="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span class="text-primary-foreground font-bold text-sm">PS</span>
              </div>
              <h1 class="text-xl font-bold text-foreground">PeerSwap</h1>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Profile
          </Button>
        </div>
      </div>
    </header>

    <div v-if="loading" class="container mx-auto px-4 py-6 text-center">
      <p>Loading item details...</p>
    </div>

    <div v-else-if="item" class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Image Gallery -->
          <Card>
            <CardContent class="p-0">
              <div class="relative">
                <img
                  :src="item.images[selectedImageIndex]"
                  :alt="item.title"
                  class="w-full h-96 object-cover rounded-t-lg"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  class="absolute top-4 right-4 bg-background/80 backdrop-blur-sm"
                  @click="toggleSave"
                >
                  <Heart :class="['h-4 w-4 mr-2', { 'fill-red-500 text-red-500': isSaved }]" />
                  {{ isSaved ? 'Saved' : 'Save' }}
                </Button>
              </div>
              <div class="p-4">
                <div class="flex gap-2 overflow-x-auto">
                  <img
                    v-for="(image, index) in item.images"
                    :key="index"
                    :src="image"
                    :alt="`${item.title} ${index + 1}`"
                    class="w-20 h-16 object-cover rounded cursor-pointer transition-all"
                    :class="selectedImageIndex === index ? 'border-2 border-primary' : 'border-2 border-transparent hover:border-primary'"
                    @click="selectedImageIndex = index"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Item Details -->
          <Card>
            <CardHeader>
              <div class="flex items-start justify-between gap-4">
                <div>
                  <CardTitle class="text-2xl mb-2">{{ item.title }}</CardTitle>
                  <div class="flex items-center gap-4 text-sm text-muted-foreground">
                    <div class="flex items-center gap-1">
                      <Clock class="h-4 w-4" />
                      <span>Posted {{ item.postedAt }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <MapPin class="h-4 w-4" />
                      <span>{{ item.location }}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{{ item.category }}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p class="text-foreground leading-relaxed mb-6">{{ item.description }}</p>

              <Separator class="my-6" />

              <div>
                <h3 class="font-semibold mb-4">Specifications</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    v-for="[key, value] in Object.entries(item.specifications)"
                    :key="key"
                    class="flex justify-between"
                  >
                    <span class="text-muted-foreground">{{ key }}:</span>
                    <span class="font-medium">{{ value }}</span>
                  </div>
                </div>
              </div>

              <Separator class="my-6" />

              <div>
                <h3 class="font-semibold mb-4">Rental Terms</h3>
                <ul class="space-y-2">
                  <li
                    v-for="(term, index) in item.rentalTerms"
                    :key="index"
                    class="flex items-start gap-2 text-sm"
                  >
                    <div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{{ term }}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Rental Card -->
          <Card>
            <CardHeader>
              <div class="text-center">
                <div class="text-3xl font-bold text-primary mb-1">
                  ${{ item.price }}
                  <span class="text-lg font-normal text-muted-foreground">/{{ item.period }}</span>
                </div>
                <Badge :variant="item.condition === 'Excellent' ? 'default' : 'secondary'">
                  {{ item.condition }} Condition
                </Badge>
              </div>
            </CardHeader>
            <CardContent class="space-y-4">
              <Button
                class="w-full"
                size="lg"
                :disabled="!item.available"
                @click="requestRental"
              >
                {{ item.available ? 'Request to Rent' : 'Currently Unavailable' }}
              </Button>
              <Button
                variant="outline"
                class="w-full bg-transparent"
                size="lg"
                @click="messageOwner"
              >
                <MessageCircle class="h-4 w-4 mr-2" />
                Message Owner
              </Button>
              <div class="text-center">
                <p class="text-xs text-muted-foreground">
                  <Shield class="h-3 w-3 inline mr-1" />
                  Protected by PeerSwap guarantee
                </p>
              </div>
            </CardContent>
          </Card>

          <!-- Owner Card -->
          <Card>
            <CardHeader>
              <CardTitle class="text-lg">Item Owner</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage :src="item.owner.avatar" />
                  <AvatarFallback>
                    {{ getInitials(item.owner.name) }}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-semibold">{{ item.owner.name }}</h4>
                    <Badge v-if="item.owner.verified" variant="secondary" class="text-xs">
                      <Shield class="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <div class="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>
                      {{ item.owner.rating }} ({{ item.owner.reviewCount }} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <p class="text-sm text-muted-foreground mb-4">
                Member since {{ item.owner.joinedDate }}
              </p>
              <Button variant="outline" class="w-full bg-transparent" size="sm">
                View Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <div v-else class="container mx-auto px-4 py-6 text-center">
      <p>Item not found</p>
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

const route = useRoute()
const router = useRouter()

// State
const item = ref(null)
const loading = ref(true)
const selectedImageIndex = ref(0)
const isSaved = ref(false)

// Mock item data (replace with Firebase later)
const mockItem = {
  id: "1",
  title: "Calculus Textbook - 8th Edition",
  description:
    "Stewart Calculus textbook in excellent condition. Perfect for MATH 101. This comprehensive textbook covers all essential calculus topics including limits, derivatives, integrals, and applications. All pages are intact with minimal highlighting. Includes access code for online resources (unused).",
  price: 15,
  period: "week",
  category: "Textbooks",
  condition: "Excellent",
  owner: {
    name: "Sarah Chen",
    avatar: "/diverse-student-profiles.png",
    rating: 4.9,
    reviewCount: 23,
    joinedDate: "September 2023",
    verified: true,
  },
  location: "Campus North",
  images: [
    "/calculus-textbook-front-cover.jpg",
    "/calculus-textbook-back-cover.jpg",
    "/calculus-textbook-inside-pages.jpg",
  ],
  available: true,
  postedAt: "2 days ago",
  specifications: {
    ISBN: "978-1285741550",
    Edition: "8th Edition",
    Author: "James Stewart",
    Publisher: "Cengage Learning",
    Year: "2015",
    Condition: "Excellent - minimal wear",
  },
  rentalTerms: [
    "Minimum rental period: 1 week",
    "Late return fee: $5 per day",
    "Security deposit: $50 (refundable)",
    "Pickup location: Campus North Library",
    "No highlighting or writing allowed",
  ],
}

// Methods
const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
}

const toggleSave = () => {
  isSaved.value = !isSaved.value
}

const requestRental = () => {
  router.push(`/request-rental/${route.params.id}`)
}

const messageOwner = () => {
  router.push('/messages')
}

// Fetch item data
onMounted(async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // In real app, fetch from Firebase:
    // const docRef = doc(db, 'listings', route.params.id)
    // const docSnap = await getDoc(docRef)
    // if (docSnap.exists()) {
    //   item.value = { id: docSnap.id, ...docSnap.data() }
    // }
    
    item.value = mockItem
  } catch (error) {
    console.error('Error fetching item:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Add any custom styles here */
</style>