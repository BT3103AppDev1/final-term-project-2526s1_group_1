<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <Card class="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle>Edit Profile</CardTitle>
          <Button variant="ghost" size="icon" @click="$emit('close')">
            <X class="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent class="space-y-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Avatar Section -->
          <div class="text-center">
            <div class="relative inline-block">
              <Avatar class="h-24 w-24 mx-auto">
                <AvatarImage :src="formData.avatar" />
                <AvatarFallback class="text-lg">
                  {{ getInitials(formData.name) }}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                class="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                @click="$refs.avatarInput.click()"
              >
                <Camera class="h-4 w-4" />
              </Button>
            </div>
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarChange"
            />
            <p class="text-sm text-muted-foreground mt-2">
              Click the camera icon to change your profile picture
            </p>
          </div>

          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="name-input" class="text-sm font-medium">Full Name *</label>
              <input
                id="name-input"
                name="name"
                v-model="formData.name"
                type="text"
                required
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your full name"
              />
            </div>

            <div class="space-y-2">
              <label for="email-input" class="text-sm font-medium">Email</label>
              <input
                id="email-input"
                name="email"
                :value="formData.email"
                type="email"
                disabled
                class="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p class="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
          </div>

          <!-- Location -->
          <div class="space-y-2">
            <label for="location-input" class="text-sm font-medium">Location</label>
            <input
              id="location-input"
              name="location"
              v-model="formData.location"
              type="text"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="e.g., Campus North, Downtown, etc."
            />
          </div>

          <!-- Short Bio -->
          <div class="space-y-2">
            <label for="short-bio-input" class="text-sm font-medium">Short Bio</label>
            <input
              id="short-bio-input"
              name="shortBio"
              v-model="formData.shortBio"
              type="text"
              maxlength="150"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Brief description (max 150 characters)"
            />
            <p class="text-xs text-muted-foreground">{{ 150 - (formData.shortBio?.length || 0) }} characters remaining</p>
          </div>

          <!-- Skills -->
          <div class="space-y-2">
            <label for="skills-input" class="text-sm font-medium">Skills</label>
            <input
              id="skills-input"
              name="skills"
              v-model="formData.skills"
              type="text"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="e.g., JavaScript, Python, Design (separate with commas)"
            />
          </div>

          <!-- Interests -->
          <div class="space-y-2">
            <label for="interests-input" class="text-sm font-medium">Interests</label>
            <input
              id="interests-input"
              name="interests"
              v-model="formData.interests"
              type="text"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="e.g., Photography, Music, Travel (separate with commas)"
            />
          </div>

          <!-- Bio -->
          <div class="space-y-2">
            <label for="bio-input" class="text-sm font-medium">Description</label>
            <textarea
              id="bio-input"
              name="bio"
              v-model="formData.bio"
              rows="4"
              maxlength="600"
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Tell others about yourself, your interests, and what you're studying... (max 600 characters)"
            />
            <p class="text-xs text-muted-foreground">{{ 600 - (formData.bio?.length || 0) }} characters remaining</p>
          </div>

          <!-- Social Media Section -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Social Media</h3>
            
            <!-- LinkedIn -->
            <div class="space-y-2">
              <label for="linkedin-input" class="text-sm font-medium">LinkedIn Profile</label>
              <input
                id="linkedin-input"
                name="linkedin"
                v-model="formData.linkedin"
                type="url"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <!-- Instagram -->
            <div class="space-y-2">
              <label for="instagram-input" class="text-sm font-medium">Instagram Profile</label>
              <input
                id="instagram-input"
                name="instagram"
                v-model="formData.instagram"
                type="url"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="https://instagram.com/yourprofile"
              />
            </div>

            <!-- Telegram -->
            <div class="space-y-2">
              <label for="telegram-input" class="text-sm font-medium">Telegram Profile</label>
              <input
                id="telegram-input"
                name="telegram"
                v-model="formData.telegram"
                type="url"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="https://t.me/yourprofile"
              />
            </div>
          </div>

          <!-- Response Time -->
          <div class="space-y-2">
            <label for="response-time-select" class="text-sm font-medium">Typical Response Time</label>
            <select
              id="response-time-select"
              name="responseTime"
              v-model="formData.responseTime"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="< 1 hour">Within 1 hour</option>
              <option value="< 3 hours">Within 3 hours</option>
              <option value="< 6 hours">Within 6 hours</option>
              <option value="< 12 hours">Within 12 hours</option>
              <option value="< 24 hours">Within 24 hours</option>
              <option value="1-2 days">1-2 days</option>
            </select>
          </div>

          <!-- Error Display -->
          <div v-if="error" class="p-3 rounded-md bg-destructive/10 border border-destructive/20">
            <p class="text-sm text-destructive">{{ error }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" @click="$emit('close')">
              Cancel
            </Button>
            <Button type="submit" :disabled="loading">
              <Loader2 v-if="loading" class="h-4 w-4 mr-2 animate-spin" />
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { X, Camera, Loader2 } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/Card.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar.vue'
import { useUserProfile } from '@/composables/useUserProfile'
import { uploadBytes, getDownloadURL, ref as storageRef } from 'firebase/storage'
import { storage, auth } from '@/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])

const { updateUserProfile, loading, error } = useUserProfile()

// Get current user for upload path
const currentUser = ref(null)
onAuthStateChanged(auth, (user) => {
  currentUser.value = user
})

// Form data
const formData = reactive({
  name: '',
  email: '',
  avatar: '',
  location: '',
  bio: '',
  shortBio: '',
  skills: '',
  interests: '',
  linkedin: '',
  instagram: '',
  telegram: '',
  responseTime: '< 1 hour'
})

// Initialize form data with user props
watch(() => props.user, (newUser) => {
  if (newUser) {
    Object.assign(formData, {
      name: newUser.name || '',
      email: newUser.email || '',
      avatar: newUser.avatar || '',
      location: newUser.location || '',
      bio: newUser.bio || '',
      shortBio: newUser.shortBio || '',
      skills: newUser.skills || '',
      interests: newUser.interests || '',
      linkedin: newUser.linkedin || '',
      instagram: newUser.instagram || '',
      telegram: newUser.telegram || '',
      responseTime: newUser.responseTime || '< 1 hour'
    })
  }
}, { immediate: true })

const avatarInput = ref(null)

// Helper functions
const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

// Handle avatar upload
const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    loading.value = true
    
    // Use your existing storage path structure
    const fileName = `profileImages/${currentUser.value.uid}/${file.name}`
    const imageRef = storageRef(storage, fileName)

    // Upload the file
    await uploadBytes(imageRef, file)

    // Get the download URL
    const downloadURL = await getDownloadURL(imageRef)
    formData.avatar = downloadURL
  } catch (err) {
    console.error('Error uploading avatar:', err)
    error.value = 'Failed to upload avatar. Please try again.'
  } finally {
    loading.value = false
  }
}

// Handle form submission
const handleSubmit = async () => {
  try {
    const success = await updateUserProfile({
      name: formData.name,
      avatar: formData.avatar,
      location: formData.location,
      bio: formData.bio,
      shortBio: formData.shortBio,
      skills: formData.skills,
      interests: formData.interests,
      linkedin: formData.linkedin,
      instagram: formData.instagram,
      telegram: formData.telegram,
      responseTime: formData.responseTime
    })

    if (success) {
      emit('updated')
      emit('close')
    }
  } catch (err) {
    console.error('Error updating profile:', err)
  }
}
</script>
