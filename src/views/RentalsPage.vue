<template>
  <div class="rentals-page p-6 max-w-6xl mx-auto">
    <h1 class="text-2xl font-semibold mb-6 text-center">My Rentals</h1>

    <div v-if="loading" class="text-center text-gray-500">Loading your rentals...</div>

    <div v-else>
      <!-- Borrowed Section -->
      <section class="mb-10">
        <h2 class="text-xl font-medium mb-3 text-blue-700">Borrowed Items</h2>
        <div v-if="borrowedItems.length" class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div
            v-for="rental in borrowedItems"
            :key="rental.id"
            class="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <img
              v-if="rental.photoUrl"
              :src="rental.photoUrl"
              alt="item"
              class="h-40 w-full object-cover rounded-lg mb-3"
            />
            <h3 class="text-lg font-semibold mb-1">{{ rental.title }}</h3>
            <p class="text-gray-600 text-sm mb-2">
              Lender: {{ rental.lenderName || 'N/A' }}<br />
              Status:
              <span
                :class="{
                  'text-yellow-600': rental.status === 'Pending',
                  'text-green-600': rental.status === 'Approved',
                  'text-gray-600': rental.status === 'Completed',
                  'text-red-600': rental.status === 'Cancelled'
                }"
                class="font-medium"
              >
                {{ rental.status }}
              </span>
            </p>

            <div v-if="rental.status === 'Completed' && !rental.borrowerRating">
              <h4 class="text-sm font-semibold mb-1">Rate this transaction:</h4>
              <div class="flex space-x-1 mb-2">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="cursor-pointer text-xl"
                  :class="star <= rental.tempRating ? 'text-yellow-400' : 'text-gray-300'"
                  @click="setTempRating(rental, star)"
                >★</span>
              </div>
              <textarea
                v-model="rental.tempReview"
                placeholder="Write a short review..."
                class="w-full border rounded-md p-2 mb-2 text-sm"
                rows="2"
              ></textarea>
              <button
                class="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                @click="submitRating(rental)"
              >
                Submit
              </button>
            </div>

            <router-link
              :to="`/item/${rental.itemId}`"
              class="text-blue-500 hover:underline text-sm"
              >View Item</router-link
            >
          </div>
        </div>
        <p v-else class="text-gray-500">You haven’t borrowed anything yet.</p>
      </section>

      <!-- Lent Section -->
      <section>
        <h2 class="text-xl font-medium mb-3 text-green-700">My Listed Items</h2>
        <div v-if="lentItems.length" class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div
            v-for="listing in lentItems"
            :key="listing.id"
            class="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <img
              v-if="listing.images && listing.images.length > 0"
              :src="listing.images[0]"
              alt="item"
              class="h-40 w-full object-cover rounded-lg mb-3"
            />
            <h3 class="text-lg font-semibold mb-1">{{ listing.name }}</h3>
            <p class="text-gray-600 text-sm mb-2">
              Price: ${{ listing.price }}/{{ listing.pricePer || 'day' }}<br />
              Category: {{ listing.category }}<br />
              Status:
              <span
                :class="{
                  'text-green-600': listing.status === 'Available',
                  'text-yellow-600': listing.status === 'Rented',
                  'text-gray-600': listing.status === 'Unavailable'
                }"
                class="font-medium"
              >
                {{ listing.status || 'Available' }}
              </span>
            </p>
            <p class="text-gray-700 text-sm mb-3">{{ listing.description || 'No description available' }}</p>

            <div class="flex gap-2">
              <router-link
                :to="`/item/${listing.id}`"
                class="text-blue-500 hover:underline text-sm"
              >
                View Item
              </router-link>
              <button
                class="text-green-500 hover:underline text-sm"
                @click="editListing(listing.id)"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500">You haven’t lent out any items yet.</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth, db } from '@/firebase/config'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore'

const borrowedItems = ref([])
const lentItems = ref([])
const loading = ref(true)

const fetchRentals = async () => {
  const user = auth.currentUser
  if (!user) {
    console.log('No authenticated user found')
    loading.value = false
    return
  }

  try {
    console.log('Fetching rentals for user:', user.uid)

    // Fetch Borrowed Items (rental transactions where user is borrower)
    const borrowedQuery = query(
      collection(db, 'requests'), 
      where('borrowerId', '==', user.uid)
    )
    const borrowedSnap = await getDocs(borrowedQuery)
    borrowedItems.value = borrowedSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      tempRating: 0,
      tempReview: ''
    }))

    // Fetch Lent Items (listings created by user)
    const lentQuery = query(
      collection(db, 'listings'), 
      where('ownerId', '==', user.uid)
    )
    const lentSnap = await getDocs(lentQuery)
    lentItems.value = lentSnap.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }))

    console.log('Borrowed items:', borrowedItems.value.length)
    console.log('Lent items (your listings):', lentItems.value.length)
    console.log('Lent items data:', lentItems.value)

  } catch (err) {
    console.error('Error fetching rentals:', err)
  } finally {
    loading.value = false
  }
}

const updateStatus = async (rental, newStatus) => {
  try {
    await updateDoc(doc(db, 'rentals', rental.id), { status: newStatus })
    rental.status = newStatus
    alert(`Status updated to ${newStatus}`)
  } catch (err) {
    console.error('Error updating status:', err)
  }
}

const setTempRating = (rental, value) => {
  rental.tempRating = value
}

const submitRating = async (rental) => {
  try {
    await updateDoc(doc(db, 'rentals', rental.id), {
      borrowerRating: rental.tempRating,
      borrowerReview: rental.tempReview,
      reviewTimestamp: serverTimestamp()
    })
    rental.borrowerRating = rental.tempRating
    rental.borrowerReview = rental.tempReview
    alert('Thank you for your feedback!')
  } catch (err) {
    console.error('Error submitting rating:', err)
  }
}

const editListing = (listingId) => {
  // Navigate to edit page - you can implement this later
  console.log('Editing listing:', listingId)
  // For now, just log the action
  alert('Edit functionality coming soon!')
}

onMounted(fetchRentals)
</script>

<style scoped>
.rentals-page {
  background-color: #f8fafc;
  min-height: 100vh;
}
button {
  transition: all 0.2s ease-in-out;
}
</style>
