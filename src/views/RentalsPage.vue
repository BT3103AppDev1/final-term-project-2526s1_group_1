<template>
  <div class="rentals-page p-6 max-w-6xl mx-auto">
    <h1 class="text-2xl font-semibold mb-6 text-center">My Rentals</h1>
    <div v-if="loading" class="text-center text-gray-500">Loading your rentals...</div>
    <div v-else>
      <!--Borrowed-->
      <section class="mb-10 text-center bg-slate-300 rounded-3xl p-4">
        <h2 class="text-xl font-bold mb-3 text-blue-700">Borrowed Items</h2>
        <div v-if="borrowedItems.length" class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div v-for="rental in borrowedItems" :key="rental.id" class="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <img v-if="rental.photoUrl" :src="rental.photoUrl" alt="item"class="h-40 w-full object-cover rounded-lg mb-3"/>
            <h3 class="text-lg font-semibold mb-1">{{ rental.title }}</h3>
            <p class="text-gray-600 text-sm mb-2">
              Lender: {{rental.lenderName||'N/A'}}<br />
              Status:
              <span
                :class="{
                  'text-yellow-600': rental.status === 'Pending',
                  'text-green-600': rental.status === 'Approved',
                  'text-gray-600': rental.status === 'Completed',
                  'text-red-600': rental.status === 'Cancelled' || rental.status === 'Rejected'
                }"
                class="font-medium"
              >
                {{rental.status}}
              </span>
            </p>
            <div v-if="rental.status==='Completed'" class="mt-3">
              <button v-if="!rental.hasReview" @click="openReviewModal(rental)" class="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm w-full">
                Leave Review</button>
            </div>
            <router-link :to="`/item/${rental.itemId}`" class="text-blue-500 hover:underline text-sm mt-2 inline-block">View Item</router-link>
          </div>
        </div>
        <p v-else class="text-gray-500">You haven't borrowed anything yet.</p>
      </section>
      <!--Rental req-->
      <section class="mb-10 text-center bg-[#dbcabd] rounded-3xl p-4">
        <h2 class="text-xl font-bold mb-3 text-orange-700">Rental Requests</h2>
        <div v-if="rentalRequests.length" class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div v-for="request in rentalRequests" :key="request.id"class="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <img v-if="request.photoUrl" :src="request.photoUrl" alt="item"class="h-40 w-full object-cover rounded-lg mb-3"/>
            <h3 class="text-lg font-semibold mb-1">{{ request.title }}</h3>
            <p class="text-gray-600 text-sm mb-2">Requested by: {{ request.borrowerName }}<br />
              Duration: {{ request.duration }} week(s)<br />
              Start Date: {{ request.startDate }}<br />
              Total: ${{ request.totalCost }}
            </p>
            <p class="text-gray-700 text-sm mb-3">{{ request.message }}</p>
            <div class="flex gap-2">
              <button @click="acceptRequest(request.id)" class="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-sm">
                Accept</button>
              <button @click="rejectRequest(request.id)" class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm">
                Reject</button>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500">No rental requests yet.</p>
      </section>
      <!--My Listed Items-->
      <section class="mb-10 text-center bg-[#c6dcc7] rounded-3xl p-4">
        <h2 class="text-xl font-bold mb-3 text-green-700">My Listed Items</h2>
        <div v-if="lentItems.length" class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div v-for="listing in lentItems" :key="listing.id" class="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <img v-if="listing.images && listing.images.length > 0":src="listing.images[0]"alt="item"class="h-40 w-full object-cover rounded-lg mb-3"/>
            <h3 class="text-lg font-semibold mb-1">{{listing.name}}</h3>
            <p class="text-gray-600 text-sm mb-2">
              Price: ${{listing.price}}/{{listing.pricePer||'day'}}<br />
              Category: {{listing.category}}<br />
              Status:
              <span
                :class="{
                  'text-green-600': listing.status === 'Available',
                  'text-yellow-600': listing.status === 'Rented',
                  'text-gray-600': listing.status === 'Unavailable'
                }"
                class="font-medium"
              >
                {{ listing.status||'Available' }}
              </span>
            </p>
            <p class="text-gray-700 text-sm mb-3">{{ listing.description || 'No description available' }}</p>
            <div class="flex gap-2">
              <router-link :to="`/item/${listing.id}`"class="text-blue-500 hover:underline text-sm">
                View Item
              </router-link>
              <button v-if="listing.status === 'Rented'" @click="markAsReturned(listing.id, listing.currentRentalId)"
                class="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 text-xs">
              Mark as Returned</button>
              <button @click="deleteItem(listing.id)" class="bg-red-800 text-white px-2 py-1 roudned-md text-xs">
                Delete</button>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500">You haven't lent out any items yet.</p>
      </section>
    </div>
  <ReviewForm v-if="reviewingRental"
    :is-open="showReviewModal"
    :rental-id="reviewingRental.id"
    :owner-id="reviewingRental.lenderId"
    :owner-name="reviewingRental.lenderName"
    :listing-id="reviewingRental.itemId"
    :listing-title="reviewingRental.title"
    @close="closeReviewModal"
    @success="handleReviewSuccess"/>
    </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {auth, db} from '@/firebase/config'
import {collection,query,where,getDocs,doc,updateDoc, deleteDoc,serverTimestamp} from 'firebase/firestore'
import ReviewForm from '@/views/ReviewForm.vue'
const showReviewModal = ref(false)
const reviewingRental = ref(null)
const borrowedItems = ref([])
const lentItems = ref([])
const loading = ref(true)
const rentalRequests = ref([])

const openReviewModal = (rental) => {
  reviewingRental.value = rental
  showReviewModal.value = true
}
const closeReviewModal = () => {
  showReviewModal.value = false
  reviewingRental.value = null
}
const handleReviewSuccess = async () => {
  console.log('Review submitted successfully')
  closeReviewModal()
  await fetchRentals()//refresh and iupdaste
  window.dispatchEvent(new CustomEvent('review-submitted', {
    detail: {
      timestamp: new Date().toISOString(),
      lenderId: reviewingRental.value?.lenderId
    }
  }))
  alert('Review submitted!')
}
const checkRentalHasReview = async (rentalId) => {
  try {
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('rentalId', '==', rentalId)
    )
    const reviewsSnap = await getDocs(reviewsQuery)
    return !reviewsSnap.empty
  } catch (error) {
    console.error('Error checking reviews:', error)
    return false
  }
}

const fetchRentals = async () => {
  const user = auth.currentUser
  if (!user) {
    loading.value = false
    return
  }
    const borrowedQuery = query(//borrowed items
      collection(db, 'rentals'), 
      where('borrowerId', '==', user.uid)
    )
    const borrowedSnap = await getDocs(borrowedQuery)
    const borrowedItemsWithReviewStatus = await Promise.all(//check each for alr reviews
      borrowedSnap.docs.map(async (doc) => {
        const rentalData = { id: doc.id, ...doc.data() }
        const hasReview = await checkRentalHasReview(doc.id)
        return { ...rentalData, hasReview }
      })
    )
    
    borrowedItems.value = borrowedItemsWithReviewStatus
    const requestsQuery = query(//rental query
      collection(db, 'rentals'), 
      where('lenderId', '==', user.uid),
      where('status', '==', 'Pending')
    )
    const requestsSnap = await getDocs(requestsQuery)
    rentalRequests.value = requestsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    const lentQuery = query(//listed
      collection(db, 'listings'), 
      where('ownerId', '==', user.uid)
    )
    const lentSnap = await getDocs(lentQuery)
    lentItems.value = lentSnap.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }))
    loading.value = false
}

const acceptRequest = async (requestId) => {
  try {
    const request = rentalRequests.value.find(req => req.id === requestId)
    if (!request) {
      alert('Rental request not found!')
      return
    }

    await updateDoc(doc(db, 'rentals', requestId), { 
      status:'Approved',
      approvedAt: serverTimestamp()
    })

    await updateDoc(doc(db, 'listings', request.itemId), {
      status: 'Rented',
      rentedAt: serverTimestamp(),
      currentRenterId: request.borrowerId,
      currentRentalId: requestId
    })

    rentalRequests.value = rentalRequests.value.filter(req => req.id !== requestId)
    
    const lentItem = lentItems.value.find(item => item.id === request.itemId)
    if (lentItem) {
      lentItem.status = 'Rented'
    }

    alert('Rental request accepted! Item is now marked as rented.')
  } catch (error) {
    console.error('Error accepting rental request:', error)
    alert('Error accepting rental request. Please try again.')
  }
}

const rejectRequest = async (requestId) => {
    const request = rentalRequests.value.find(req=>req.id === requestId)
    if (!request) {
      alert('Rental request not found!')
      return
    }
    await updateDoc(doc(db,'rentals',requestId), { 
      status:'Rejected',rejectedAt:serverTimestamp()
    })
    await updateDoc(doc(db,'listings',request.itemId), {
      status: 'Available',lastRejectedAt: serverTimestamp()
    })
    rentalRequests.value = rentalRequests.value.filter(req => req.id !== requestId)
    const lentItem = lentItems.value.find(item => item.id === request.itemId)
    if (lentItem) {
      lentItem.status = 'Available'
    }
    alert('Rental request rejected. Item available.')
}
const markAsReturned = async (itemId, rentalId) => {
  if (!rentalId) {
    alert('No active rental found for this item.')
    return
  }
    await updateDoc(doc(db, 'rentals', rentalId), {
      status: 'Completed',
      returnedAt: serverTimestamp(),
      lenderMarkedReturned: true
    })
    await updateDoc(doc(db, 'listings', itemId), {
      status: 'Available',
      completedAt: serverTimestamp(),
      currentRenterId: null,
      currentRentalId: null
    })

    const lentItem = lentItems.value.find(item => item.id === itemId)
    if (lentItem) {
      lentItem.status = 'Available'
      lentItem.currentRenterId = null
      lentItem.currentRentalId = null
    }
    alert('Item returned and available for rent!')
}
const deleteItem= async(itemId)=> {//delete func to allow for delisting of items
  if (!confirm('Confirm that you want to delete listing?')) {
    return
  }
  await deleteDoc(doc(db,'listings',itemId))//remove from firebase
  lentItems.value = lentItems.value.filter(item => item.id!==itemId)
  alert('Item deleted from Browse Page!')
}
onMounted(fetchRentals)
</script>