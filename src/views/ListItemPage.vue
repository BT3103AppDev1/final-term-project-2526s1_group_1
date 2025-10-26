<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Enhanced Header Section -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-slate-200 mb-6">
          <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
          </div>
          <div class="text-left">
            <h2 class="text-3xl font-bold text-slate-900">List Your Item</h2>
            <p class="text-slate-600">Share your unused items and earn extra money</p>
          </div>
        </div>
      </div>

      <!-- Enhanced Form -->
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Enhanced Basic Information -->
        <Card class="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-30"></div>
          <CardHeader class="relative">
            <CardTitle class="flex items-center gap-2 text-slate-900">
              <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              Basic Information
            </CardTitle>
            <CardDescription class="text-slate-600">Tell us about your item in detail</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6 relative">
            <div class="space-y-3">
              <Label for="title" class="text-slate-700 font-semibold">Item Title *</Label>
              <Input
                id="title"
                v-model="formData.title"
                placeholder="e.g., Calculus Textbook - 8th Edition"
                required
                class="bg-white/60 border-slate-300 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-3">
                <Label class="text-slate-700 font-semibold">Category *</Label>
                <CustomSelect 
                  v-model="formData.category" 
                  :options="[
                    { value: 'Textbooks', label: '📚 Textbooks' },
                    { value: 'Electronics', label: '💻 Electronics' },
                    { value: 'Equipment', label: '🔧 Equipment' },
                    { value: 'Supplies', label: '📝 Supplies' },
                    { value: 'Furniture', label: '🪑 Furniture' },
                    { value: 'Clothing', label: '👕 Clothing' }
                  ]"
                  placeholder="Select category"
                />
              </div>

              <div class="space-y-3">
                <Label class="text-slate-700 font-semibold">Condition *</Label>
                <CustomSelect 
                  v-model="formData.condition" 
                  :options="[
                    { value: 'Excellent', label: '✨ Excellent - Like new' },
                    { value: 'Good', label: '👍 Good - Minor wear' },
                    { value: 'Fair', label: '⚖️ Fair - Visible wear' }
                  ]"
                  placeholder="Select condition"
                />
              </div>
            </div>

            <div class="space-y-3">
              <Label for="description" class="text-slate-700 font-semibold">Description *</Label>
              <Textarea
                id="description"
                v-model="formData.description"
                placeholder="Describe your item in detail. Include information about condition, usage, special features, and anything else that would help potential renters..."
                :rows="4"
                required
                class="bg-white/60 border-slate-300 focus:border-blue-400 focus:ring-blue-400 resize-none"
              />
              <p class="text-xs text-slate-500">Be detailed and honest - good descriptions lead to successful rentals!</p>
            </div>
          </CardContent>
        </Card>

        <!-- Enhanced Images Section -->
        <Card class="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-30"></div>
          <CardHeader class="relative">
            <CardTitle class="flex items-center gap-2 text-slate-900">
              <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              Photos
            </CardTitle>
            <CardDescription class="text-slate-600">
              Add up to 5 photos of your item. High-quality photos help your item get rented faster!
            </CardDescription>
          </CardHeader>
          <CardContent class="relative">
            <div
              :class="[
                'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200',
                dragActive 
                  ? 'border-blue-400 bg-blue-50 shadow-lg' 
                  : 'border-slate-300 bg-white/40 hover:border-blue-300 hover:bg-blue-50/50'
              ]"
              @dragover.prevent="dragActive = true"
              @dragleave="dragActive = false"
              @drop.prevent="handleDrop"
            >
              <div class="flex flex-col items-center">
                <div class="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4">
                  <Upload class="h-8 w-8 text-blue-600" />
                </div>
                <h3 class="text-lg font-semibold text-slate-900 mb-2">Upload Photos</h3>
                <p class="text-slate-600 mb-4 max-w-sm">Drag and drop your images here, or click the button below to browse files</p>
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  @change="handleFileSelect"
                  class="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  class="border-blue-300 text-blue-700 hover:bg-blue-50"
                  @click="$refs.fileInput.click()"
                >
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  Choose Files
                </Button>
              </div>
            </div>

            <!-- Enhanced Image Preview -->
            <div v-if="images.length > 0" class="mt-6">
              <h4 class="font-semibold text-slate-900 mb-4">Uploaded Photos ({{ images.length }}/5)</h4>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div
                  v-for="(image, index) in images"
                  :key="index"
                  class="relative group"
                >
                  <img
                    :src="image"
                    :alt="`Upload ${index + 1}`"
                    class="w-full h-32 object-cover rounded-xl shadow-md"
                  />
                  <Button
                    type="button"
                    size="sm"
                    class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    @click="removeImage(index)"
                  >
                    <X class="h-4 w-4" />
                  </Button>
                  <div class="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {{ index + 1 }}
                  </div>
                </div>
              </div>
              <p class="text-xs text-slate-500 mt-3">Tip: The first image will be used as the main photo</p>
            </div>
          </CardContent>
        </Card>

        <!-- Enhanced Pricing & Availability -->
        <section class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
              <DollarSign class="h-5 w-5 text-white" />
            </div>
            <h2 class="text-xl font-semibold text-slate-800">Pricing & Availability</h2>
          </div>

          <div class="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 p-6 shadow-lg backdrop-blur-sm">
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <Label for="price" class="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <DollarSign class="h-4 w-4 text-green-600" />
                    Rental Price *
                  </Label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span class="text-slate-500 text-lg font-medium">$</span>
                    </div>
                    <Input
                      id="price"
                      v-model.number="formData.price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      class="pl-10 h-12 text-lg font-medium border-slate-300 focus:border-green-500 focus:ring-green-500/20 bg-white/70 backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>

                <div class="space-y-2">
                  <Label class="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Duration *
                  </Label>
                  <CustomSelect 
                    v-model="formData.period" 
                    :options="[
                      { value: 'day', label: '📅 Per Day' },
                      { value: 'week', label: '🗓️ Per Week' },
                      { value: 'month', label: '📊 Per Month' }
                    ]"
                    placeholder="Per Week"
                    class="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white/70 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <Label class="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <svg class="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Pickup Location *
                </Label>
                <CustomSelect 
                  v-model="formData.location" 
                  :options="[
                    { value: 'Campus North', label: '🏫 Campus North' },
                    { value: 'Campus South', label: '🏫 Campus South' },
                    { value: 'Campus Center', label: '🏫 Campus Center' },
                    { value: 'Off Campus', label: '🏠 Off Campus (specify in notes)' }
                  ]"
                  placeholder="Select pickup location"
                  class="h-12 border-slate-300 focus:border-red-500 focus:ring-red-500/20 bg-white/70 backdrop-blur-sm"
                />
                <p class="text-xs text-slate-500 bg-blue-50 rounded-lg p-2 border border-blue-200">
                  📍 Choose the most convenient pickup location for renters
                </p>
              </div>

              <div class="space-y-2">
                <Label for="availability" class="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <svg class="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  Availability Notes
                </Label>
                <Textarea
                  id="availability"
                  v-model="formData.availabilityNotes"
                  placeholder="Any specific availability requirements or pickup instructions..."
                  class="min-h-[100px] border-slate-300 focus:border-purple-500 focus:ring-purple-500/20 bg-white/70 backdrop-blur-sm resize-none"
                  :rows="4"
                />
                <p class="text-xs text-slate-500 bg-purple-50 rounded-lg p-2 border border-purple-200">
                  💬 Include any special instructions or time preferences for pickup/return
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Enhanced Submit Section -->
        <section class="space-y-6 pt-4 border-t border-slate-200">
          <div class="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 p-6 shadow-lg backdrop-blur-sm">
            <div class="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                class="flex-1 h-14 text-base font-medium border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                @click="saveAsDraft"
                :disabled="loading"
              >
                <span class="flex items-center gap-2">
                  📝 Save as Draft
                </span>
              </Button>
              <Button 
                type="submit" 
                class="flex-1 h-14 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                :disabled="loading"
              >
                <span class="flex items-center gap-2">
                  {{ loading ? '⏳ Publishing...' : '🚀 Publish Item' }}
                </span>
              </Button>
            </div>
            <p class="text-xs text-slate-500 text-center mt-4 bg-slate-50 rounded-lg p-3 border border-slate-200">
              💡 <strong>Tip:</strong> Save as draft to continue editing later, or publish to make your item available for rent immediately
            </p>
          </div>
        </section>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Upload, X, DollarSign } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/Card.vue'
import Input from '@/components/ui/input.vue'
import Label from '@/components/ui/Label.vue'
import Textarea from '@/components/ui/TextArea.vue'
import Badge from '@/components/ui/Badge.vue'
import CustomSelect from '@/components/ui/select.vue'
import { useListings } from '@/composables/useListings'

const router = useRouter()
const { createListing, loading } = useListings()

// State
const images = ref([]) // Preview URLs for display
const imageFiles = ref([]) // Actual File objects for Firebase
const dragActive = ref(false)
const fileInput = ref(null)

// Form data
const formData = reactive({
  title: '',
  category: '',
  condition: '',
  description: '',
  price: 0,
  period: 'week',
  location: '',
  availabilityNotes: ''
})

// Methods
const handleFileSelect = (event) => {
  const files = event.target.files
  handleImageUpload(files)
}

const handleDrop = (event) => {
  dragActive.value = false
  const files = event.dataTransfer.files
  handleImageUpload(files)
}

const handleImageUpload = (files) => {
  if (files) {
    const remainingSlots = 5 - images.value.length
    const filesToAdd = Array.from(files).slice(0, remainingSlots)
    
    // Store the actual File objects for Firebase upload
    imageFiles.value = [...imageFiles.value, ...filesToAdd]
    
    // Create preview URLs for display
    const newPreviews = filesToAdd.map(file => URL.createObjectURL(file))
    images.value = [...images.value, ...newPreviews]
  }
}

const removeImage = (index) => {
  // Clean up the preview URL to prevent memory leaks
  URL.revokeObjectURL(images.value[index])
  
  // Remove from both arrays
  images.value = images.value.filter((_, i) => i !== index)
  imageFiles.value = imageFiles.value.filter((_, i) => i !== index)
}

const saveAsDraft = async () => {
  try {
    console.log('Saving as draft...', formData)
    // TODO: Implement save as draft functionality
    // You can create a similar function in useListings.js for drafts
    alert('Item saved as draft!')
  } catch (error) {
    console.error('Error saving draft:', error)
    alert('Error saving draft. Please try again.')
  }
}

const handleSubmit = async () => {
  // Validate that we have at least one image
  if (imageFiles.value.length === 0) {
    alert('Please upload at least one image')
    return
  }

  // Validate required fields
  if (!formData.title || !formData.category || !formData.condition || 
      !formData.description || !formData.price || !formData.location) {
    alert('Please fill in all required fields')
    return
  }

  // Validate price is positive
  if (formData.price <= 0) {
    alert('Price must be greater than 0')
    return
  }

  try {
    console.log('Publishing item...', formData, imageFiles.value)
    
    // Use the composable to create listing in Firebase
    const listingId = await createListing(formData, imageFiles.value)
    
    // Success! Navigate to the new item page
    alert('Item published successfully!')
    router.push(`/item/${listingId}`)
  } catch (error) {
    console.error('Error publishing item:', error)
    alert('Error publishing item. Please try again.')
  }
}
</script>

<style scoped>
/* Add any custom styles here */
</style>