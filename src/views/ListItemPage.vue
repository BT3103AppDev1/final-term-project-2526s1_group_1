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

    <div class="container mx-auto px-4 py-6 max-w-2xl">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-foreground mb-2">List Your Item</h2>
        <p class="text-muted-foreground">
          Share your unused items with fellow students and earn some extra money
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Basic Information -->
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Tell us about your item</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="title">Item Title *</Label>
              <Input
                id="title"
                v-model="formData.title"
                placeholder="e.g., Calculus Textbook - 8th Edition"
                required
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="category">Category *</Label>
                <Select v-model="formData.category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="textbooks">Textbooks</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="supplies">Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-2">
                <Label for="condition">Condition *</Label>
                <Select v-model="formData.condition" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div class="space-y-2">
              <Label for="description">Description *</Label>
              <Textarea
                id="description"
                v-model="formData.description"
                placeholder="Describe your item in detail. Include any important information about condition, usage, or special features..."
                :rows="4"
                required
              />
            </div>
          </CardContent>
        </Card>

        <!-- Images -->
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
            <CardDescription>
              Add up to 5 photos of your item. Good photos help your item get rented faster!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              :class="[
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                dragActive ? 'border-primary bg-primary/5' : 'border-border'
              ]"
              @dragover.prevent="dragActive = true"
              @dragleave="dragActive = false"
              @drop.prevent="handleDrop"
            >
              <Upload class="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p class="text-muted-foreground mb-2">Drag and drop images here, or click to select</p>
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
                @click="$refs.fileInput.click()"
              >
                Choose Files
              </Button>
            </div>

            <div v-if="images.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div
                v-for="(image, index) in images"
                :key="index"
                class="relative group"
              >
                <img
                  :src="image"
                  :alt="`Upload ${index + 1}`"
                  class="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  class="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  @click="removeImage(index)"
                >
                  <X class="h-3 w-3" />
                </Button>
                <Badge v-if="index === 0" class="absolute bottom-2 left-2 text-xs">
                  Main Photo
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Pricing & Availability -->
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Availability</CardTitle>
            <CardDescription>Set your rental price and availability</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="price">Rental Price *</Label>
                <div class="relative">
                  <DollarSign class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    v-model.number="formData.price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    class="pl-10"
                    required
                  />
                </div>
              </div>

              <div class="space-y-2">
                <Label for="period">Per</Label>
                <Select v-model="formData.period">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div class="space-y-2">
              <Label for="location">Pickup Location *</Label>
              <Select v-model="formData.location" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select pickup location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="campus-north">Campus North</SelectItem>
                  <SelectItem value="campus-south">Campus South</SelectItem>
                  <SelectItem value="campus-center">Campus Center</SelectItem>
                  <SelectItem value="off-campus">Off Campus (specify in notes)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label for="availability">Availability Notes</Label>
              <Textarea
                id="availability"
                v-model="formData.availabilityNotes"
                placeholder="Any specific availability requirements or pickup instructions..."
                :rows="3"
              />
            </div>
          </CardContent>
        </Card>

        <!-- Submit -->
        <div class="flex gap-4">
          <Button
            type="button"
            variant="outline"
            class="flex-1 bg-transparent"
            @click="saveAsDraft"
            :disabled="loading"
          >
            Save as Draft
          </Button>
          <Button 
            type="submit" 
            class="flex-1"
            :disabled="loading"
          >
            {{ loading ? 'Publishing...' : 'Publish Item' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Upload, X, DollarSign } from 'lucide-vue-next'
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
import Textarea from '@/components/ui/Textarea.vue'
import Select from '@/components/ui/select.vue'
import Badge from '@/components/ui/badge.vue'
import { useListings } from '@/composables/useListing.js'

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