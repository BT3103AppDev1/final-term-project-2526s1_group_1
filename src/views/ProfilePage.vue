<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header
      class="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 w-full"
    >
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/browse" class="flex items-center gap-2">
          <div
            class="h-8 w-8 rounded-lg bg-primary flex items-center justify-center"
          >
            <span class="text-primary-foreground font-bold text-sm">PS</span>
          </div>
          <h1 class="text-xl font-bold text-foreground">PeerSwap</h1>
        </router-link>

        <!-- Desktop Buttons -->
        <div class="hidden sm:flex items-center gap-2">
          <Button variant="ghost" size="sm" as-child>
            <router-link to="/browse" class="flex items-center gap-1">
              <ArrowLeft class="h-4 w-4" />
              Back to Browse
            </router-link>
          </Button>

          <Button variant="outline" size="sm" as-child>
            <router-link to="/list-item">List Item</router-link>
          </Button>

          <Button variant="outline" size="sm" as-child>
            <router-link to="/profile/settings" class="flex items-center gap-1">
              <Edit class="h-4 w-4" />
              Edit Profile
            </router-link>
          </Button>
        </div>

        <!-- Mobile Dropdown -->
        <div class="sm:hidden relative">
          <Button
            variant="outline"
            size="icon"
            class="p-2"
            @click="menuOpen = !menuOpen"
          >
            <Menu class="h-5 w-5" />
          </Button>
          <transition
            enter-active-class="transition ease-out duration-150"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-100"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="menuOpen"
              class="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-50"
            >
              <ul class="text-sm text-foreground">
                <li>
                  <router-link
                    to="/browse"
                    class="block px-4 py-2 hover:bg-accent"
                    @click="menuOpen = false"
                  >
                    ← Back to Browse
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/list-item"
                    class="block px-4 py-2 hover:bg-accent"
                    @click="menuOpen = false"
                  >
                    List Item
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/profile/settings"
                    class="block px-4 py-2 hover:bg-accent"
                    @click="menuOpen = false"
                  >
                    Edit Profile
                  </router-link>
                </li>
              </ul>
            </div>
          </transition>
        </div>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="container mx-auto px-4 py-6 text-center">
      <p>Loading profile...</p>
    </div>

    <!-- Profile Page -->
    <div v-else-if="user" class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar -->
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
                  <Badge
                    v-if="user.verified"
                    variant="secondary"
                    class="text-xs"
                  >
                    <Shield class="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                <div class="flex items-center justify-center gap-1 mb-2">
                  <Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span class="font-semibold">{{ user.rating }}</span>
                  <span class="text-muted-foreground"
                    >({{ user.reviewCount }} reviews)</span
                  >
                </div>
                <div
                  class="flex items-center justify-center gap-1 text-sm text-muted-foreground"
                >
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
                <Button
                  variant="outline"
                  class="w-full bg-transparent"
                  size="sm"
                  @click="toggleFollow"
                >
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
              <TabsTrigger value="listings"
                >Listings ({{ userItems.length }})</TabsTrigger
              >
              <TabsTrigger value="reviews"
                >Reviews ({{ reviews.length }})</TabsTrigger
              >
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>

            <!-- Overview -->
            <TabsContent value="overview" class="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p class="text-foreground leading-relaxed">
                    {{ user.bio }}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Listings</CardTitle>
                  <CardDescription
                    >Latest items from {{ user.name }}</CardDescription
                  >
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
  Eye,
  ArrowLeft,
  Menu
} from 'lucide-vue-next'

import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardHeader from '@/components/ui/Cardheader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import Badge from '@/components/ui/badge.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar.vue'
import Tabs from '@/components/ui/tabs.vue'
import TabsList from '@/components/ui/TabsList.vue'
import TabsTrigger from '@/components/ui/TabsTrigger.vue'
import TabsContent from '@/components/ui/TabsContent.vue'
import Separator from '@/components/ui/Separator.vue'
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
const menuOpen = ref(false) // for mobile menu toggle

// Mock data
const mockUser = {
  id: 'user-1',
  name: 'Sarah Chen',
  email: 'sarah.chen@university.edu',
  avatar: '/diverse-student-profiles.png',
  joinedDate: 'September 2023',
  location: 'Campus North',
  verified: true,
  rating: 4.9,
  reviewCount: 23,
  totalRentals: 45,
  responseTime: '< 1 hour',
  bio: 'Engineering student passionate about sustainability and sharing resources.',
  stats: {
    itemsListed: 8,
    itemsRented: 12,
    totalEarnings: 340,
    successfulTransactions: 45
  }
}

const mockUserItems = [
  { id: '1', title: 'Dummy ItemCard', views: 24, favorites: 5 },
  { id: '2', title: 'Dummy ItemCard', views: 18, favorites: 3 }
]

const mockReviews = [
  {
    id: '1',
    reviewer: { name: 'Mike Johnson', avatar: '', rating: 5 },
    rating: 5,
    comment: 'Sarah was incredibly responsive.',
    item: 'Calculus Textbook - 8th Edition',
    date: '1 week ago'
  }
]

// Methods
const getInitials = (name) => name.split(' ').map((n) => n[0]).join('')
const sendMessage = () => router.push('/messages')
const toggleFollow = () => (isFollowing.value = !isFollowing.value)

// Fetch user data
onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  user.value = mockUser
  userItems.value = mockUserItems
  reviews.value = mockReviews
  loading.value = false
})
</script>

<style scoped>
.dropdown {
  transition: all 0.3s ease;
}
</style>
