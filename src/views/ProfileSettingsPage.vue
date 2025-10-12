<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <router-link to="/browse" class="flex items-center gap-2">
          <div class="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span class="text-primary-foreground font-bold text-sm">PS</span>
          </div>
          <h1 class="text-xl font-bold text-foreground">PeerSwap</h1>
        </router-link>

        <Button variant="outline" size="sm" as-child>
          <router-link to="/profile">Back to Profile</router-link>
        </Button>
      </div>
    </header>

    <!-- Profile Settings Form -->
    <div class="container mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-6">Edit Profile</h2>

      <Card class="max-w-2xl mx-auto">
        <CardContent class="p-6 space-y-6">
          <div class="space-y-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium mb-1">Full Name</label>
              <Input v-model="form.name" placeholder="Your name" />
            </div>

            <!-- Location -->
            <div>
              <label class="block text-sm font-medium mb-1">Location</label>
              <Input v-model="form.location" placeholder="Campus North, South..." />
            </div>

            <!-- Bio -->
            <div>
              <label class="block text-sm font-medium mb-1">Bio</label>
              <textarea
                v-model="form.bio"
                rows="4"
                class="w-full rounded-md border border-input bg-background p-2 text-sm focus:ring-2 focus:ring-ring"
                placeholder="Write a short bio about yourself..."
              ></textarea>
            </div>

            <!-- Avatar Upload -->
            <div>
              <label class="block text-sm font-medium mb-1">Profile Picture</label>
              <input type="file" accept="image/*" @change="handleFileUpload" />
              <div v-if="previewUrl" class="mt-3">
                <img :src="previewUrl" alt="Preview" class="h-24 w-24 rounded-full object-cover border" />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3">
            <Button variant="outline" @click="cancelEdit">Cancel</Button>
            <Button variant="custom" class="bg-orange-500 hover:bg-orange-700" @click="saveProfile">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/button.vue'
import Input from '@/components/ui/input.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'

// Firebase (optional integration later)
import { auth, db, storage } from '@/firebase/config'
import { updateDoc, doc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const router = useRouter()

const form = ref({
  name: 'Sarah Chen',
  location: 'Campus North',
  bio: 'Engineering student passionate about sustainability and sharing resources.',
  avatar: '',
})

const previewUrl = ref(null)

function handleFileUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  previewUrl.value = URL.createObjectURL(file)
  form.value.avatar = file
}

async function saveProfile() {
  try {
    console.log('Saving profile:', form.value)

    // Example Firebase logic (uncomment if connected)
    // const user = auth.currentUser
    // if (!user) return
    // let avatarUrl = form.value.avatar
    // if (form.value.avatar instanceof File) {
    //   const fileRef = storageRef(storage, `avatars/${user.uid}.jpg`)
    //   await uploadBytes(fileRef, form.value.avatar)
    //   avatarUrl = await getDownloadURL(fileRef)
    // }
    // await updateDoc(doc(db, 'users', user.uid), {
    //   name: form.value.name,
    //   location: form.value.location,
    //   bio: form.value.bio,
    //   avatar: avatarUrl,
    // })

    alert('Profile updated successfully!')
    router.push('/profile')
  } catch (error) {
    console.error('Error saving profile:', error)
  }
}

function cancelEdit() {
  router.push('/profile')
}
</script>

<style scoped>
textarea {
  resize: none;
}
</style>
