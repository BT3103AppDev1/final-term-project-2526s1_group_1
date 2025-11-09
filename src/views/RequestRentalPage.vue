<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-10 pt-4 pb-2">
      <Button variant="ghost" size="sm" as-child class="border border-gray-600 mb-4">
        <router-link :to="`/item/${itemId}`" class="flex items-center font-bold">
          <ArrowLeftCircleIcon class="mr-2"/> Back to Item
        </router-link>
      </Button>
    </div>
    <!-- Loading -->
    <div v-if="loading" class="container mx-auto px-4 py-6 text-center">
      <div class="flex flex-col items-center justify-center min-h-[400px]">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p>Loading item details...</p>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="item" class="container mx-auto px-4 py-6 max-w-4xl">
      <div class="mb-8 border-0 shadow-lg bg-stone-200 rounded-lg text-center py-2">
        <h2 class="text-3xl font-bold text-slate-900 mb-2">Request Rental</h2>
        <p class="text-muted-foreground">Send a rental request to the item owner</p>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Form Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Item Summary -->
          <Card class="border-0 shadow-lg bg-stone-100">
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex gap-4">
                <img
                  :src="item.image"
                  :alt="item.title"
                  class="w-24 h-24 rounded-lg object-cover"
                />
                <div class="flex-1">
                  <h3 class="font-semibold text-lg mb-2">{{ item.title }}</h3>
                  <div class="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <Badge variant="outline">{{ item.category }}</Badge>
                    <Badge variant="secondary">{{ item.condition }}</Badge>
                    <span>${{ item.price }}/{{ item.period }}</span>
                  </div>
                  <p class="text-sm text-muted-foreground">{{ item.description }}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Owner Info -->
          <Card class="border-0 shadow-lg bg-stone-100">
          <CardHeader>
            <CardTitle>Item Owner</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center gap-4">
              <Avatar class="h-12 w-12">
                <AvatarImage :src="item.ownerAvatar" />
                <AvatarFallback>{{ getInitials(item.ownerName) }}</AvatarFallback>
              </Avatar>
              <div class="flex-1">
                <h4 class="font-semibold">{{ item.ownerName }}</h4>
                <p class="text-sm text-muted-foreground">
                  ⭐ Rating: {{ ownerRating }} | 📝 Reviews: {{ ownerReviewCount }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>


          <!-- Rental Details Form -->
          <Card class="border-0 shadow-lg bg-stone-100">
            <CardHeader>
              <CardTitle>Rental Details</CardTitle>
              <CardDescription>Specify your rental duration and message</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <!-- <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="startDate">Start Date</Label>
                  <div class="relative">
                    <Calendar class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="startDate" v-model="startDate" type="date" class="pl-10" :min="minDate" />
                  </div>
                </div>

                <div class="space-y-2">
                  <Label for="endDate">End Date</Label>
                  <div class="relative">
                    <Calendar class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="endDate" v-model="endDate" type="date" class="pl-10" :min="startDate || minDate" />
                  </div>
                </div>
              </div> -->

              <div class="space-y-2">
                <Label for="duration">Duration ({{ unit }}s)</Label>
                <div class="relative">
                  <Clock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="duration"
                    v-model.number="duration"
                    type="number"
                    class="pl-10"
                    :min="item.minRentalPeriod"
                  />
                </div>
                <p class="text-xs text-muted-foreground">
                  Minimum: {{ item.minRentalPeriod }} {{ unit }}(s)
                  <!-- Maximum: {{ item.maxRentalPeriod }} {{ unit }}(s) -->
                </p>
              </div>

              <div class="space-y-2">
                <Label for="message">Message to Owner</Label>
                <Textarea id="message" v-model="message" placeholder="Introduce yourself and explain why you need this item." :rows="4" maxlength="500"/>
                <p class="text-xs text-muted-foreground">{{ message.length }}/500 characters</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <!-- Summary Column -->
        <div>
          <Card class="sticky top-24 bg-amber-50">
            <CardHeader>
              <CardTitle>Rental Summary</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-3">
                <div class="flex justify-between text-sm">
                  <span>Rental cost ({{ duration }} {{ unit }}{{ duration !== 1 ? 's' : '' }})</span>
                  <span>${{ totalRentalCost }}</span>
                </div>
                <Separator />
                <div class="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${{ totalCost }}</span>
                </div>
              </div>
              <Button class="w-full" size="lg" @click="handleSubmitRequest"
                :disabled="!isFormValid || submitting">
                {{ submitting ? 'Sending Request...' : 'Send Rental Request' }}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Core Vue
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Calendar, Shield, ArrowLeft, Clock, ArrowLeftCircleIcon } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card.vue'
import Input from '@/components/ui/input.vue'
import Label from '@/components/ui/Label.vue'
import Textarea from '@/components/ui/TextArea.vue'
import Badge from '@/components/ui/Badge.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar.vue'
import { Separator } from '@/components/ui/Separator.vue'
import { auth, db } from '@/firebase/config'
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useReviews } from '@/composables/useReviews'

const route = useRoute()
const router = useRouter()
const itemId = route.params.id
const loading = ref(true)
const submitting = ref(false)
const item = ref(null)
// const startDate = ref('')
// const endDate = ref('')
const message = ref('')
const duration = ref(1)
const unit = computed(() => item.value?.period || 'week')
const { getUserAverageRating } = useReviews()
const ownerRating = ref(0)
const ownerReviewCount = ref(0)

const minDate = computed(() => new Date().toISOString().split('T')[0])
const totalRentalCost = computed(() => item.value ? item.value.price * duration.value : 0)
const totalCost = computed(() => item.value ? totalRentalCost.value + item.value.securityDeposit : 0)
const isFormValid = computed(() =>
  message.value.trim().length > 0 &&
  duration.value >= (item.value?.minRentalPeriod || 1)
  //duration.value <= (item.value?.maxRentalPeriod || 4)
)


const getInitials = (name) => name?.split(' ').map(n => n[0]).join('') || '?'//helper function

//Submit rental req
const handleSubmitRequest = async () => {
  if (!isFormValid.value) return alert('Please complete all required fields.')
  const user = auth.currentUser
  submitting.value = true
  try {
    const rentalData = {
      title: item.value.title,photoUrl: item.value.image || '',
      borrowerId: user.uid,borrowerName: user.displayName || 'Anonymous',
      lenderId: item.value.ownerId, lenderName: item.value.ownerName,
      itemId: itemId, 
      duration: duration.value, message: message.value, totalRentalCost: totalRentalCost.value,
      totalCost: totalCost.value, status: 'Pending', createdAt: serverTimestamp()
    }
    await addDoc(collection(db, 'rentals'), rentalData)
    alert('Rental request sent successfully!')
    router.push('/rentals')
  } catch (err) {
    console.error('Error submitting rental request:', err)
    alert('Error sending rental request. Please try again.')
  } finally {
    submitting.value = false
  }
}
onMounted(async () => {//get itemdetails from firestore
  try {
    const user = auth.currentUser
    if (!user) {
      alert('Please login to request a rental.')
      router.push('/login')
      return
    }

    const docRef = doc(db, 'listings', itemId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data()
      
      // Check if user is trying to rent their own item
      if (data.ownerId === user.uid) {
        alert('You cannot request a rental for your own item.')
        router.push(`/item/${itemId}`)
        return
      }

      item.value = {id: docSnap.id, title: data.title, description: data.description,
        price: data.price, period: data.period, category: data.category,
        condition: data.condition,image: data.images && data.images.length > 0 ? data.images[0]:'/placeholder.jpg',
        ownerId: data.ownerId, ownerName: data.ownerName,ownerAvatar: data.ownerAvatar || '/default-user.png',
        securityDeposit: data.securityDeposit || 0, minRentalPeriod: data.minRentalPeriod || 1,maxRentalPeriod: data.maxRentalPeriod || 4
      }

      try {
          const ownerRef = doc(db, 'User Information', data.ownerId)
          const ownerSnap = await getDoc(ownerRef)
          if (ownerSnap.exists()) {
            console.log('Owner data found:', ownerSnap.data())
            const ownerData = ownerSnap.data()
            const resolvedAvatar = ownerData.profileImageUrl || '/default-user.png'
            item.value = { ...item.value, ownerAvatar: resolvedAvatar }
            const { average, total } = await getUserAverageRating(data.ownerId)
            ownerRating.value = average
            ownerReviewCount.value = total
          } else {
            console.warn('No owner doc found for', data.ownerId)
          }
        } catch (err) {
          console.error('Error fetching owner info:', err)
        }

    } else {
      alert('Item not found.')
      router.push('/browse')
    }
  } catch (error) {
    console.error('Error fetching item:', error)
    alert('Unable to load item details.')
  } finally {
    loading.value = false
  }
})
</script>
