<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl lg:text-5xl font-bold mb-6">
            Find What You Need
          </h1>
          <p class="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Browse thousands of items shared by fellow students. From textbooks to electronics, 
            find everything you need at unbeatable prices.
          </p>
          
          <!-- Featured Search Bar -->
          <div class="max-w-2xl mx-auto">
            <div class="bg-white rounded-2xl p-2 shadow-xl">
              <div class="flex">
                <div class="relative flex-1">
                  <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search for textbooks, electronics, equipment..."
                    class="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 rounded-xl border-0 focus:ring-0 focus:outline-none text-lg"
                  />
                </div>
                <button 
                  @click="performSearch"
                  class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors ml-2"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters and Results -->
    <section class="py-8">
      <div class="container mx-auto px-4">
        <!-- Quick Filters -->
        <div class="mb-8">
          <div class="flex flex-wrap gap-3 items-center justify-center lg:justify-start">
            <button 
              v-for="category in quickFilters" 
              :key="category.id"
              @click="setCategory(category.id)"
              :class="[
                'px-6 py-3 rounded-full font-medium transition-all duration-200',
                selectedCategory === category.id
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200 hover:border-orange-200'
              ]"
            >
              <span class="mr-2">{{ category.icon }}</span>
              {{ category.name }}
            </button>
          </div>
        </div>

        <!-- Results Header and Sorting -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              {{ getResultsTitle() }}
            </h2>
            <p class="text-gray-600">
              {{ filteredItems.length }} {{ filteredItems.length === 1 ? 'item' : 'items' }} found
              {{ selectedCategory !== 'all' ? `in ${getCategoryName(selectedCategory)}` : '' }}
            </p>
          </div>
          
          <div class="flex gap-3">
            <button 
              @click="fetchItems"
              :disabled="loading"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ loading ? 'Refreshing...' : 'Refresh' }}
            </button>

            <label class="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <input 
                type="checkbox" 
                v-model="showRentedItems" 
                class="rounded"
              />
              <span class="text-sm">Show rented items</span>
            </label>
            
            <select 
              v-model="sortBy"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
            
            <div class="flex border border-gray-300 rounded-lg overflow-hidden">
              <button 
                @click="viewMode = 'grid'"
                :class="[
                  'p-2 transition-colors',
                  viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-500 hover:text-gray-700'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
              </button>
              <button 
                @click="viewMode = 'list'"
                :class="[
                  'p-2 transition-colors',
                  viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-500 hover:text-gray-700'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Items Grid/List -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <!-- Loading Skeletons -->
          <div v-for="n in 8" :key="n" class="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
            <div class="h-48 bg-gray-200"></div>
            <div class="p-4 space-y-3">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              <div class="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>

        <div 
          v-else 
          :class="[
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          ]"
        >
          <!-- Item Cards -->
          <div 
            v-for="item in paginatedItems" 
            :key="item.id"
            :class="[
              'bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer border border-gray-100 hover:border-orange-200',
              viewMode === 'list' ? 'flex' : ''
            ]"
            @click="goToItem(item.id)"
          >
            <!-- Image -->
            <div :class="[
              'relative overflow-hidden',
              viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'h-48'
            ]">
              <img 
                :src="item.image || '/api/placeholder/300/200'"
                :alt="item.title"
                :class="[
                  'w-full h-full object-cover group-hover:scale-105 transition-transform duration-200',
                ]"
              />
              <div class="absolute top-3 left-3">
                <span 
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    item.available && item.status !== 'Rented' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ item.available && item.status !== 'Rented' ? 'Available' : 'Rented' }}
                </span>
              </div>
              <div class="absolute top-3 right-3">
                <button class="w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div :class="[
              'p-4',
              viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''
            ]">
              <div>
                <div class="flex items-start justify-between mb-2">
                  <h3 :class="[
                    'font-semibold text-gray-900 group-hover:text-orange-600 transition-colors',
                    viewMode === 'list' ? 'text-lg' : 'text-base'
                  ]">
                    {{ item.title }}
                  </h3>
                </div>
                
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                  {{ item.description }}
                </p>

                <div class="flex items-center gap-2 mb-3">
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span class="text-gray-500 text-sm">{{ item.location || 'Campus' }}</span>
                  </div>
                  
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span class="text-gray-500 text-sm">{{ item.rating || '4.8' }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <span class="text-2xl font-bold text-orange-600">
                    ${{ item.price }}
                  </span>
                  <span class="text-gray-500 text-sm">/{{ item.period || 'week' }}</span>
                </div>
                
                <button 
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition-colors text-sm',
                    item.available && item.status !== 'Rented'
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  ]"
                  :disabled="!item.available || item.status === 'Rented'"
                >
                  {{ item.available && item.status !== 'Rented' ? 'Rent Now' : 'Not Available' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredItems.length === 0" class="text-center py-16">
          <div class="max-w-md mx-auto">
            <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p class="text-gray-600 mb-6">
              Try adjusting your search terms or browse different categories.
            </p>
            <button 
              @click="clearFilters"
              class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="!loading && filteredItems.length > itemsPerPage" class="mt-12 flex justify-center">
          <nav class="flex items-center gap-2">
            <button 
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-4 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div class="flex gap-1">
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="currentPage = page"
                :class="[
                  'w-10 h-10 rounded-lg font-medium transition-colors',
                  currentPage === page 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { collection, getDocs, query, orderBy, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase.js'

const router = useRouter()

// Reactive data
const searchQuery = ref('')
const selectedCategory = ref('all')
const sortBy = ref('newest')
const viewMode = ref('grid')
const currentPage = ref(1)
const itemsPerPage = ref(12)
const loading = ref(true)
const items = ref([])
const showRentedItems = ref(false) // New filter for rented items

// Quick filter categories
const quickFilters = ref([
  { id: 'all', name: 'All Items', icon: '🔍' },
  { id: 'textbooks', name: 'Textbooks', icon: '📚' },
  { id: 'electronics', name: 'Electronics', icon: '💻' },
  { id: 'equipment', name: 'Equipment', icon: '🔧' },
  { id: 'furniture', name: 'Furniture', icon: '🪑' },
  { id: 'clothing', name: 'Clothing', icon: '👕' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'other', name: 'Other', icon: '📦' }
])

// Fetch items from Firebase
const fetchItems = async () => {
  try {
    loading.value = true
    console.log('Fetching items from Firebase...')
    
    const listingsRef = collection(db, 'listings')
    const listingsQuery = query(listingsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(listingsQuery)
    
    const fetchedItems = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      fetchedItems.push({
        id: doc.id,
        title: data.title || data.name || 'Untitled Item',
        description: data.description || 'No description available',
        price: data.price || 0,
        period: data.period || data.pricePer || 'day',
        category: data.category ? data.category.toLowerCase() : 'other',
        location: data.location || 'Location not specified',
        rating: 4.5, // Default rating since we don't have reviews yet
        image: data.images && data.images.length > 0 ? data.images[0] : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
        status: data.status || 'Available', // Include status field
        available: (data.status === 'Available' || data.status === 'active') && data.status !== 'Rented' && data.status !== 'Unavailable', // Available if not rented or unavailable
        owner: data.ownerName || 'Unknown',
        createdAt: data.createdAt
      })
    })
    
    items.value = fetchedItems
    console.log(`Fetched ${fetchedItems.length} items from Firebase`)
    
    // If no items found, show a helpful message
    if (fetchedItems.length === 0) {
      console.log('No items found. Make sure you have listed some items!')
    }
    
  } catch (error) {
    console.error('Error fetching items:', error)
    // Fallback to empty array if Firebase fails
    items.value = []
  } finally {
    loading.value = false
  }
}

// Computed properties
const filteredItems = computed(() => {
  let filtered = items.value

  // Filter by availability (hide rented items by default)
  if (!showRentedItems.value) {
    filtered = filtered.filter(item => item.available && item.status !== 'Rented')
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    )
  }

  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(item => item.category === selectedCategory.value)
  }

  // Sort items
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'popular':
        return b.rating - a.rating
      case 'newest':
      default:
        return b.id - a.id
    }
  })

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage.value)
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredItems.value.slice(start, end)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 2

  const range = []
  const rangeWithDots = []

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }

  if (current - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (current + delta < total - 1) {
    rangeWithDots.push('...', total)
  } else {
    rangeWithDots.push(total)
  }

  return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index)
})

// Methods
const performSearch = () => {
  currentPage.value = 1
  // Trigger reactive search through searchQuery
}

const setCategory = (categoryId) => {
  selectedCategory.value = categoryId
  currentPage.value = 1
}

// Debug function to test status updates
const debugUpdateItemStatus = async (itemId, status) => {
  try {
    await updateDoc(doc(db, 'listings', itemId), {
      status: status,
      debugUpdated: serverTimestamp()
    })
    console.log(`Item ${itemId} status updated to ${status}`)
    fetchItems() // Refresh the list
  } catch (error) {
    console.error('Error updating item status:', error)
  }
}

// Expose debug function to console
window.debugUpdateItemStatus = debugUpdateItemStatus

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  sortBy.value = 'newest'
  currentPage.value = 1
}

const goToItem = (itemId) => {
  router.push(`/item/${itemId}`)
}

const getResultsTitle = () => {
  if (searchQuery.value) {
    return `Search Results for "${searchQuery.value}"`
  }
  if (selectedCategory.value !== 'all') {
    return getCategoryName(selectedCategory.value)
  }
  return 'All Items'
}

const getCategoryName = (categoryId) => {
  const category = quickFilters.value.find(cat => cat.id === categoryId)
  return category ? category.name : 'Items'
}

// Reset pagination when filters change
watch([searchQuery, selectedCategory, sortBy], () => {
  currentPage.value = 1
})

// Refresh items periodically to catch status updates
let refreshInterval = null

// Initialize
onMounted(() => {
  fetchItems()
  
  // Set up auto-refresh every 30 seconds to catch status updates
  refreshInterval = setInterval(() => {
    fetchItems()
  }, 30000)
})

// Cleanup on unmount
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
