import { ref } from 'vue'
import { db, auth } from '@/firebase/config'
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore'

export function useRentals() {
  const loading = ref(false)
  const error = ref(null)

  // Create rental request
  const createRentalRequest = async (requestData) => {
    loading.value = true
    error.value = null

    try {
      if (!auth.currentUser) {
        throw new Error('You must be logged in to request a rental')
      }

      // Get listing details
      const listingRef = doc(db, 'listings', requestData.listingId)
      const listingSnap = await getDoc(listingRef)

      if (!listingSnap.exists()) {
        throw new Error('Listing not found')
      }

      const listing = listingSnap.data()

      // Create rental request document
      const docRef = await addDoc(collection(db, 'requests'), {
        listingId: requestData.listingId,
        listingTitle: listing.title,
        borrowerId: auth.currentUser.uid,
        borrowerName: auth.currentUser.displayName,
        borrowerEmail: auth.currentUser.email,
        ownerId: listing.ownerId,
        ownerName: listing.ownerName,
        startDate: requestData.startDate,
        endDate: requestData.endDate,
        duration: requestData.duration,
        message: requestData.message,
        totalRentalCost: requestData.totalRentalCost,
        securityDeposit: requestData.securityDeposit,
        totalCost: requestData.totalCost,
        status: 'pending', // pending, approved, declined, completed, cancelled
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      return docRef.id
    } catch (err) {
      error.value = err.message
      console.error('Error creating rental request:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get rental requests for a user (as borrower)
  const getMyRequests = async () => {
    loading.value = true
    error.value = null

    try {
      if (!auth.currentUser) {
        throw new Error('You must be logged in')
      }

      const q = query(
        collection(db, 'requests'),
        where('borrowerId', '==', auth.currentUser.uid)
      )
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get rental requests for a user (as owner)
  const getIncomingRequests = async () => {
    loading.value = true
    error.value = null

    try {
      if (!auth.currentUser) {
        throw new Error('You must be logged in')
      }

      const q = query(
        collection(db, 'requests'),
        where('ownerId', '==', auth.currentUser.uid)
      )
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Approve rental request
  const approveRequest = async (requestId) => {
    loading.value = true
    error.value = null

    try {
      const docRef = doc(db, 'requests', requestId)
      await updateDoc(docRef, {
        status: 'approved',
        approvedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Decline rental request
  const declineRequest = async (requestId, reason = '') => {
    loading.value = true
    error.value = null

    try {
      const docRef = doc(db, 'requests', requestId)
      await updateDoc(docRef, {
        status: 'declined',
        declineReason: reason,
        declinedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Complete rental (mark as returned)
  const completeRental = async (requestId) => {
    loading.value = true
    error.value = null

    try {
      const docRef = doc(db, 'requests', requestId)
      await updateDoc(docRef, {
        status: 'completed',
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    createRentalRequest,
    getMyRequests,
    getIncomingRequests,
    approveRequest,
    declineRequest,
    completeRental
  }
}