<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/browse" class="flex items-center gap-2">
            <div class="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span class="text-primary-foreground font-bold text-sm">PS</span>
            </div>
            <h1 class="text-xl font-bold text-foreground">PeerSwap</h1>
          </router-link>
          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" as-child>
              <router-link to="/list-item">List Item</router-link>
            </Button>
            <Button variant="outline" size="sm" as-child>
              <router-link to="/profile/settings">
                <Edit class="h-4 w-4 mr-2" />
                Edit Profile
              </router-link>
            </Button>
          </div>
        </div>
      </div>
    </header>

    <div v-if="loading" class="container mx-auto px-4 py-6 text-center">
      <p>Loading profile...</p>
    </div>

    <div v-else-if="user" class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Profile Sidebar -->
        <div class="lg:col-span-1">
          <Card class="sticky top-24">
            <CardContent class="p-6">
              <div class="text-center mb-6">
                <Avatar class="h-24 w-24 mx-auto mb-4">
                  <AvatarImage :src="user.avatar" />
                  <AvatarFallback class="text-lg">
                    {{ getInitials(user.name) }}
                  </AvatarFallback>
                </Avatar>
                <div class="flex items-center justify-center gap-2 mb-2">
                  <h2 class="text-xl font-bold">{{ user.name }}</h2>
                  <Badge v-if="user.verified" variant="secondary" class="text-xs">
                    <Shield class="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                <div class="flex items-center justify-center gap-1 mb-2">
                  <Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span class="font-semibold">{{ user.rating }}</span>
                  <span class="text-muted-foreground">({{ user.reviewCount }} reviews)</span>
                </div>
                <div class="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <MapPin class="h-4 w-4" />
                  <span>{{ user.location }}</span>
                </div>
              </div>

              <Separator class="my-4" />

              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Member since:</span>
                  <span class="font-medium">{{ user.joinedDate }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Response time:</span>
                  <span class="font-medium">{{ user.responseTime }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Total rentals:</span>
                  <span class="font-medium">{{ user.totalRentals }}</span>
                </div>
              </div>

              <Separator class="my-4" />

              <div class="space-y-2">
                <Button class="w-full" size="sm" @click="sendMessage">
                  <MessageCircle class="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" class="w-full bg-transparent" size="sm" @click="toggleFollow">
                  <Heart class="h-4 w-4 mr-2" />
                  {{ isFollowing ? 'Unfollow' : 'Follow' }}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <Tabs v-model="activeTab" class="space-y-6">
            <TabsList class="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="listings">Listings ({{ userItems.length }})</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({{ reviews.length }})</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>

            <!-- Overview Tab -->
            <TabsContent value="overview" class="space-y-6">
              <!-- About -->
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p class="text-foreground leading-relaxed">{{ user.bio }}</p>
                </CardContent>
              </Card>

              <!-- Recent Listings -->
              <Card>
                <CardHeader>
                  <CardTitle>Recent Listings</CardTitle>
                  <CardDescription>Latest items from {{ user.name }}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ItemCard
                      v-for="item in userItems.slice(0, 2)"
                      :key="item.id"
                      :item="item"
                    />
                  </div>
                </CardContent>
              </Card>

              <!-- Recent Reviews -->
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                  <CardDescription>What others are saying</CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="space-y-4">
                    <ReviewCard
                      v-for="review in reviews.slice(0, 2)"
                      :key="review.id"
                      :review="review"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <!-- Listings Tab -->
            <TabsContent value="listings" class="space-y-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">My Listings</h3>
                <Button as-child>
                  <router-link to="/list-item">Add New Item</router-link>
                </Button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="item in userItems" :key="item.id" class="relative">
                  <ItemCard :item="item" />
                  <div class="absolute top-2 left-2 flex gap-1">
                    <Badge variant="secondary" class="text-xs">
                      <Eye class="h-3 w-3 mr-1" />
                      {{ item.views }}
                    </Badge>
                    <Badge variant="secondary" class="text-xs">
                      <Heart class="h-3 w-3 mr-1" />
                      {{ item.favorites }}
                    </Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            <!-- Reviews Tab -->
            <TabsContent value="reviews" class="space-y-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">Reviews & Ratings</h3>
                <div class="flex items-center gap-2">
                  <Star class="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span class="text-lg font-semibold">{{ user.rating }}</span>
                  <span class="text-muted-foreground">({{ user.reviewCount }} reviews)</span>
                </div>
              </div>
              <div class="space-y-4">
                <ReviewCard
                  v-for="review in reviews"
                  :key="review.id"
                  :review="review"
                />
              </div>
            </TabsContent>

            <!-- Stats Tab -->
            <TabsContent value="stats" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent class="p-6 text-center">
                    <div class="text-2xl font-bold text-primary mb-1">
                      {{ user.stats.itemsListed }}
                    </div>
                    <p class="text-sm text-muted-foreground">Items Listed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent class="p-6 text-center">
                    <div class="text-2xl font-bold text-primary mb-1">
                      {{ user.stats.itemsRented }}
                    </div>
                    <p class="text-sm text-muted-foreground">Items Rented</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent class="p-6 text-center">
                    <div class="text-2xl font-bold text-primary mb-1">
                      ${{ user.stats.totalEarnings }}
                    </div>
                    <p class="text-sm text-muted-foreground">Total Earnings</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent class="p-6 text-center">
                    <div class="text-2xl font-bold text-primary mb-1">
                      {{ user.stats.successfulTransactions }}
                    </div>
                    <p class="text-sm text-muted-foreground">Successful Transactions</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="space-y-4">
                    <div class="flex justify-between items-center">
                      <span class="text-muted-foreground">Response Rate</span>
                      <span class="font-semibold">98%</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-muted-foreground">On-time Delivery</span>
                      <span class="font-semibold">100%</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-muted-foreground">Customer Satisfaction</span>
                      <span class="font-semibold">4.9/5.0</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-muted-foreground">Repeat Customers</span>
                      <span class="font-semibold">35%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Star,
  MapPin,
  Shield,
  Edit,
  MessageCircle,
  Heart,
  Eye
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import ItemCard from '@/components/ItemCard.vue'
import ReviewCard from '@/components/ReviewCard.vue'

const route = useRoute()
const router = useRouter()

// State
const activeTab = ref('overview')
const loading = ref(true)
const isFollowing = ref(false)
const user = ref(null)
const userItems = ref([])
const reviews = ref([])

// Mock user data (replace with Firebase later)
const mockUser = {
  id: "user-1",
  name: "Sarah Chen",
  email: "sarah.chen@university.edu",
  avatar: "/diverse-student-profiles.png",
  joinedDate: "September 2023",
  location: "Campus North",
  verified: true,
  rating: 4.9,
  reviewCount: 23,
  totalRentals: 45,
  responseTime: "< 1 hour",
  bio: "Engineering student passionate about sustainability and sharing resources. I believe in building a community where students help each other succeed while being environmentally conscious.",
  stats: {
    itemsListed: 8,
    itemsRented: 12,
    totalEarnings: 340,
    successfulTransactions: 45,
  },
}

const mockUserItems = [
  {
    id: "1",
    title: "Calculus Textbook - 8th Edition",
    description: "Stewart Calculus textbook in excellent condition.",
    price: 15,
    period: "week",
    category: "Textbooks",
    condition: "Excellent",
    owner: "Sarah Chen",
    rating: 4.9,
    location: "Campus North",
    image: "/calculus-textbook-front-cover.jpg",
    available: true,
    postedAt: "2 days ago",
    views: 24,
    favorites: 5,
  },
  {
    id: "7",
    title: "Engineering Mechanics Textbook",
    description: "Hibbeler Engineering Mechanics - Statics & Dynamics",
    price: 20,
    period: "week",
    category: "Textbooks",
    condition: "Good",
    owner: "Sarah Chen",
    rating: 4.9,
    location: "Campus North",
    image: "/placeholder.svg?key=eng-mech",
    available: true,
    postedAt: "1 week ago",
    views: 18,
    favorites: 3,
  },
]

const mockReviews = [
  {
    id: "1",
    reviewer: {
      name: "Mike Johnson",
      avatar: "/placeholder.svg?key=mike",
      rating: 5,
    },
    rating: 5,
    comment:
      "Sarah was incredibly responsive and the textbook was exactly as described. Pickup was smooth and convenient. Highly recommend!",
    item: "Calculus Textbook - 8th Edition",
    date: "1 week ago",
  },
  {
    id: "2",
    reviewer: {
      name: "Emma Davis",
      avatar: "/placeholder.svg?key=emma",
      rating: 5,
    },
    rating: 5,
    comment: "Great communication and the item was in perfect condition. Sarah is very trustworthy and professional.",
    item: "Engineering Mechanics Textbook",
    date: "2 weeks ago",
  },
  {
    id: "3",
    reviewer: {
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg?key=alex",
      rating: 4,
    },
    rating: 4,
    comment:
      "Good experience overall. The book helped me pass my exam. Minor wear but nothing that affected usability.",
    item: "Calculus Textbook - 8th Edition",
    date: "3 weeks ago",
  },
]

// Methods
const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
}

const sendMessage = () => {
  router.push('/messages')
}

const toggleFollow = () => {
  isFollowing.value = !isFollowing.value
  // In real app: Update follow status in Firebase
}

// Fetch user data
onMounted(async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // In real app, fetch from Firebase:
    // const userId = route.params.id || auth.currentUser.uid
    // const userDoc = await getDoc(doc(db, 'users', userId))
    // if (userDoc.exists()) {
    //   user.value = { id: userDoc.id, ...userDoc.data() }
    // }
    
    user.value = mockUser
    userItems.value = mockUserItems
    reviews.value = mockReviews
  } catch (error) {
    console.error('Error fetching profile:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Add any custom styles here */
</style>