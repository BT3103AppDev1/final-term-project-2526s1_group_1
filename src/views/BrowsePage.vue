<template>
  <div class="min-h-screen bg-background w-full">
    <header class="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 w-full">
      <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2">
          <div class="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span class="text-primary-foreground font-bold text-sm">PS</span>
          </div>
          <h1 class="text-xl font-bold text-foreground">PeerSwap</h1>
        </router-link>


        <div class="flex items-center gap-3">
          <Button variant="outline" size="sm" as-child>
            <router-link to="/list-item">List Item</router-link>
          </Button>

          <Button variant="outline" size="sm" as-child>
            <router-link to="/profile">Profile</router-link>
          </Button>

        <template v-if="user">
          <div class="flex items-center gap-3">
            <span class="text-sm text-muted-foreground">
              {{ user.email }}
            </span>
            <Button variant="outline" size="sm" @click="logoutUser" class="ml-2">
              Log Out
            </Button>
          </div>
        </template>



          <template v-else>
            <Button variant="default" size="sm" as-child>
              <router-link to="/login">Log In</router-link>
            </Button>
          </template>
        </div>
      </div>  
    </div>
  </header>


    <div class="container mx-auto px-4 py-6">
      <!-- Search and Filters -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row gap-4 mb-4">
          <!-- Search bar -->
          <div class="relative flex-1">
            <Search class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              v-model="searchQuery"
              placeholder="Search for textbooks, electronics, equipment..."
              class="pl-10"
            />
          </div>

          <Select
            v-model="selectedCategory"
            :options="categoryOptions"
            placeholder="Category"
            class="w-full md:w-48"
          />

          <Select
            v-model="sortBy"
            :options="sortOptions"
            placeholder="Sort by"
            class="w-full md:w-48"
          />
        </div>

        <div class="flex items-center justify-between">
          <p class="text-muted-foreground">{{ filteredItems.length }} items available</p>
          <Button variant="outline" size="sm">
            <Filter class="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      <!-- Items Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ItemCard
          v-for="item in sortedItems"
          :key="item.id"
          :item="item"
        />
      </div>

      <!-- No Results -->
      <div v-if="filteredItems.length === 0" class="text-center py-12">
        <p class="text-muted-foreground mb-4">No items found matching your criteria</p>
        <Button variant="outline" @click="clearFilters">
          Clear Filters
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { Search, Filter } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import Input from '@/components/ui/input.vue'
import Select from '@/components/ui/select.vue'
import ItemCard from '@/components/ui/ItemCard.vue'

const user = ref(null)
const router = useRouter()

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
  })
})

const logoutUser = async () => {
  await signOut(auth)
  user.value = null
  router.push('/login')
}


const searchQuery = ref('')
const selectedCategory = ref('all')
const sortBy = ref('newest')

// Options for custom Select component
const categoryOptions = [
  { label: 'All Categories', value: 'all' },
  { label: 'Textbooks', value: 'Textbooks' },
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Equipment', value: 'Equipment' },
  { label: 'Supplies', value: 'Supplies' },
]

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Highest Rated', value: 'rating' },
]

// Mock data
const mockItems = ref([
  {
    id: "1",
    title: "Calculus Textbook - 8th Edition",
    description: "Stewart Calculus textbook in excellent condition. Perfect for MATH 101.",
    price: 15,
    period: "week",
    category: "Textbooks",
    condition: "Excellent",
    owner: "Sarah Chen",
    rating: 4.9,
    location: "Campus North",
    image: "/calculus-textbook.png",
    available: true,
    postedAt: "2 days ago",
  },
  {
    id: "2",
    title: 'MacBook Pro 13" (2021)',
    description: "M1 MacBook Pro with 8GB RAM, 256GB SSD. Great for coding and design work.",
    price: 50,
    period: "week",
    category: "Electronics",
    condition: "Good",
    owner: "Mike Johnson",
    rating: 4.8,
    location: "Campus South",
    image: "/macbook-pro-laptop.png",
    available: true,
    postedAt: "1 day ago",
  },
  {
    id: "3",
    title: "Canon DSLR Camera Kit",
    description: "Canon EOS Rebel T7i with 18-55mm lens and accessories. Perfect for photography class.",
    price: 30,
    period: "week",
    category: "Equipment",
    condition: "Excellent",
    owner: "Emma Davis",
    rating: 5.0,
    location: "Campus Center",
    image: "/canon-dslr-camera.jpg",
    available: false,
    postedAt: "3 days ago",
  },
  {
    id: "4",
    title: "Scientific Calculator TI-84",
    description: "Texas Instruments TI-84 Plus CE. Required for statistics and engineering courses.",
    price: 8,
    period: "week",
    category: "Supplies",
    condition: "Good",
    owner: "Alex Rodriguez",
    rating: 4.7,
    location: "Campus North",
    image: "/ti-84-calculator.jpg",
    available: true,
    postedAt: "5 days ago",
  },
  {
    id: "5",
    title: "Organic Chemistry Lab Kit",
    description: "Complete lab kit with glassware and safety equipment. All items sanitized.",
    price: 25,
    period: "week",
    category: "Supplies",
    condition: "Good",
    owner: "Lisa Park",
    rating: 4.6,
    location: "Campus South",
    image: "/chemistry-lab-equipment.png",
    available: true,
    postedAt: "1 week ago",
  },
  {
    id: "6",
    title: 'iPad Pro 11" with Apple Pencil',
    description: "Perfect for digital note-taking and design work. Includes keyboard case.",
    price: 40,
    period: "week",
    category: "Electronics",
    condition: "Excellent",
    owner: "David Kim",
    rating: 4.9,
    location: "Campus Center",
    image: "/ipad-pro-apple-pencil.jpg",
    available: true,
    postedAt: "4 days ago",
  },
])

// Computed filters
const filteredItems = computed(() => {
  return mockItems.value.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory =
      selectedCategory.value === 'all' || item.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

// Sorting
const sortedItems = computed(() => {
  const items = [...filteredItems.value]
  switch (sortBy.value) {
    case 'price-low':
      return items.sort((a, b) => a.price - b.price)
    case 'price-high':
      return items.sort((a, b) => b.price - a.price)
    case 'rating':
      return items.sort((a, b) => b.rating - a.rating)
    default:
      return items
  }
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  sortBy.value = 'newest'
}
</script>

<style scoped></style>
