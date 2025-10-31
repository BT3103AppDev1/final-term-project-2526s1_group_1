<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-12">
      <div class="flex flex-col items-center justify-center min-h-[400px]">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-slate-600 text-lg">Loading profile...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!user" class="container mx-auto px-4 py-12">
      <div class="flex flex-col items-center justify-center min-h-[400px]">
        <div class="text-6xl mb-4">😞</div>
        <h2 class="text-2xl font-bold text-slate-800 mb-2">Profile Not Found</h2>
        <p class="text-slate-600 mb-6 text-center">Unable to load your profile information. Please try again.</p>
        <Button as-child>
          <router-link to="/profile">
            <ArrowLeft class="h-4 w-4 mr-2" />
            Back to Profile
          </router-link>
        </Button>
      </div>
    </div>

    <!-- Main Edit Profile Content -->
    <div v-else class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        
        <!-- Page Header -->
        <div class="mb-8">
          <div class="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" as-child class="hover:bg-slate-100 transition-colors">
              <router-link to="/profile" class="flex items-center gap-2">
                <ArrowLeft class="h-4 w-4" />
                <span>Back to Profile</span>
              </router-link>
            </Button>
          </div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Profile
          </h1>
          <p class="text-slate-600 mt-2">Update your profile information and preferences</p>
        </div>

        <!-- Edit Profile Form -->
        <Card class="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50 opacity-30"></div>
          <CardContent class="relative p-8">
            <form @submit.prevent="handleSubmit" class="space-y-8">
              
              <!-- Profile Picture Section -->
              <div class="text-center">
                <div class="relative inline-block mb-6">
                  <div class="h-32 w-32 mx-auto ring-4 ring-white shadow-lg rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <img v-if="formData.avatar" :key="formData.avatar" :src="formData.avatar" class="w-full h-full object-cover" alt="Profile picture"/>
                    <span v-else class="text-white text-2xl font-bold">
                      {{ getInitials(formData.name || user.name) }}
                    </span>
                  </div>
                  <button
                    type="button"
                    @click="triggerFileUpload"
                    class="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    <Camera class="h-5 w-5" />
                  </button>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleImageUpload"
                    class="hidden"
                  />
                </div>
                <p class="text-sm text-slate-500">Click the camera icon to change your profile picture</p>
              </div>

              <!-- Personal Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-semibold text-slate-700">Full Name *</label>
                  <input
                    v-model="formData.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div class="space-y-2">
                  <label class="text-sm font-semibold text-slate-700">Email</label>
                  <input
                    :value="user.email"
                    type="email"
                    disabled
                    class="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                  <p class="text-xs text-slate-500">Email cannot be changed</p>
                </div>
              </div>

              <!-- Location -->
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700">Location</label>
                <input
                  v-model="formData.location"
                  type="text"
                  class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
                  placeholder="Enter your location"
                />
              </div>

              <!-- Bio Section -->
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700">Short Bio</label>
                <textarea
                  v-model="formData.shortBio"
                  rows="3"
                  maxlength="200"
                  class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all resize-none"
                  placeholder="Tell us a bit about yourself..."
                ></textarea>
                <p class="text-xs text-slate-500">{{ 200 - (formData.shortBio?.length || 0) }} characters remaining</p>
              </div>

              <!-- Skills -->
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700">Skills</label>
                <input
                  v-model="formData.skills"
                  type="text"
                  class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
                  placeholder="e.g. JavaScript, Vue.js, Photography (separate with commas)"
                />
                <p class="text-xs text-slate-500">Separate multiple skills with commas</p>
              </div>

              <!-- Interests -->
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700">Interests</label>
                <input
                  v-model="formData.interests"
                  type="text"
                  class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
                  placeholder="e.g. Technology, Photography, Travel (separate with commas)"
                />
                <p class="text-xs text-slate-500">Separate multiple interests with commas</p>
              </div>

              <!-- Description -->
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  v-model="formData.bio"
                  rows="4"
                  class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all resize-none"
                  placeholder="Write a detailed description about yourself, your experience, and what you're looking for..."
                ></textarea>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                <Button
                  type="submit"
                  :disabled="saving"
                  class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg py-3"
                >
                  <div v-if="saving" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {{ saving ? 'Saving...' : 'Save Changes' }}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  @click="router.push('/profile')"
                  class="flex-1 border-slate-300 hover:bg-slate-50 py-3"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { doc, updateDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/firebase/config'
import { ArrowLeft, Camera } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import { Card, CardContent } from '@/components/ui/Card.vue'
import { useUserProfile } from '@/composables/useUserProfile'

const router = useRouter()
const { user, loading, loadUserProfile } = useUserProfile()
const saving = ref(false)
const fileInput = ref(null)
const avatarTimestamp = ref(Date.now())
// Form data
const formData = reactive({
  name: '',
  location: '',
  shortBio: '',
  bio: '',
  skills: '',
  interests: '',
  linkedin: '',
  instagram: '',
  telegram: '',
  avatar: ''
})

// Initialize form data when user is loaded
watch(user, (newUser) =>{
  if (newUser) {
      formData.name= newUser.name || '',
      formData.location= newUser.location || '',
      formData.shortBio= newUser.shortBio || '',
      formData.bio= newUser.bio || '',
      formData.skills= newUser.skills || '',
      formData.interests= newUser.interests || '',
      formData.linkedin= newUser.linkedin || '',
      formData.instagram =newUser.instagram || '',
      formData.telegram = newUser.telegram || '',
      formData.avatar=newUser.avatar || ''
    }
}, {immediate:true})

onMounted(async () =>{
  await loadUserProfile()
})
const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    saving.value = true
    const imageRef = storageRef(storage, `profile-pictures/${user.value.id}/${Date.now()}_${file.name}`)
    console.log('Uploading to:', imageRef.fullPath) // DEBUG
    const snapshot = await uploadBytes(imageRef, file)
    console.log('Upload complete:', snapshot) // DEBUG
    const downloadURL = await getDownloadURL(snapshot.ref)
    console.log('Download URL:', downloadURL) // DEBUG
    formData.avatar = downloadURL
    avatarTimestamp.value=Date.now()
    console.log('formData.avatar updated:', formData.avatar) // DEBUG
  } catch (error) {
    console.error('Upload error:', error) // DEBUG
    alert('Failed to upload image. Please try again.')
  } finally {
    saving.value = false
  }
}

const handleSubmit = async () => {
  if (!user.value?.id) return
  try {
    saving.value = true
    
    const userRef = doc(db, 'User Information', user.value.id)
    await updateDoc(userRef, {
      name: formData.name,
      location: formData.location,
      shortBio: formData.shortBio,
      description: formData.bio,
      skills: formData.skills,
      interests: formData.interests,
      linkedin: formData.linkedin,
      instagram: formData.instagram,
      telegram: formData.telegram,
      profileImageUrl: formData.avatar,
      updatedAt: new Date()
    })
    alert('Profile updated successfully!')
    router.push('/profile')
  } catch (error) {
    alert('Failed to update profile. Please try again.')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.gradient-border {
  background: linear-gradient(white, white) padding-box,
              linear-gradient(to right, #3b82f6, #8b5cf6) border-box;
  border: 2px solid transparent;
}
</style>
