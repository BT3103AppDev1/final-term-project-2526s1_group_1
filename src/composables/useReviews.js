import { ref } from 'vue'
import { db, auth } from '@/firebase/config'
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  doc,
  getDoc
} from 'firebase/firestore'

export function useReviews() {
  const loading = ref(false)
  const error = ref(null)

  const createReview = async (reviewData) => {
  loading.value = true
  error.value = null

  try {
    if (!auth.currentUser) {
      throw new Error('You must be logged in to leave a review')
    }

    const docRef = await addDoc(collection(db, 'reviews'), {
      reviewerId: auth.currentUser.uid,
      reviewerName: auth.currentUser.displayName || 'Anonymous',
      reviewerEmail: auth.currentUser.email,
      reviewerAvatar: auth.currentUser.photoURL || '/placeholder-user.jpg',
      ownerId: reviewData.ownerId,
      ownerName: reviewData.ownerName,
      listingId: reviewData.listingId,
      listingTitle: reviewData.listingTitle,
      rentalId: reviewData.rentalId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      // Include both percentage and star ratings
      responseRate: Math.min(Number(reviewData.responseRate), 100),
      onTimeDelivery: Math.min(Number(reviewData.onTimeDelivery), 100),
      responseRating: reviewData.responseRating, // 1-5 stars
      conditionRating: reviewData.conditionRating, // 1-5 stars
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    console.log('Review created with ID:', docRef.id)
    return docRef.id
  } catch (err) {
    console.error('Error creating review:', err)
    error.value = err.message
    throw err
  } finally {
    loading.value = false
  }
}
  // Get reviews for a specific user (as owner)
  const getUserReviews = async (userId = null) => {
    loading.value = true
    error.value = null

    try {
      // Use current user if no userId provided
      const targetUserId = userId || auth.currentUser?.uid
      
      if (!targetUserId) {
        throw new Error('User ID is required')
      }

      console.log('Fetching reviews for user:', targetUserId)

      // Query reviews where ownerId matches the target user
      const q = query(
        collection(db, 'reviews'),
        where('ownerId', '==', targetUserId)
      )

      const querySnapshot = await getDocs(q)
      const reviews = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        reviews.push({
          id: doc.id,
          reviewer: {
            name: data.reviewerName || 'Anonymous',
            avatar: data.reviewerAvatar || '/placeholder-user.jpg',
            rating: data.rating
          },
          rating: data.rating || 5,
          comment: data.comment || '',
          item: data.listingTitle || 'Unknown Item',
          date: data.createdAt ? 
            new Date(data.createdAt.seconds * 1000).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            }) : 'Recently',
          createdAt: data.createdAt,
          listingId: data.listingId,
          rentalId: data.rentalId,
          responseRate: data.responseRate || 98,
          onTimeDelivery: data.onTimeDelivery || 100
        })
      })

      // Sort by creation date in JavaScript (newest first)
      reviews.sort((a, b) => {
        if (!a.createdAt && !b.createdAt) return 0
        if (!a.createdAt) return 1
        if (!b.createdAt) return -1
        return b.createdAt.seconds - a.createdAt.seconds
      })

      console.log(`Found ${reviews.length} reviews for user ${targetUserId}`)
      return reviews
    } catch (err) {
      console.error('Error fetching user reviews:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get reviews for a specific listing
  const getListingReviews = async (listingId) => {
    loading.value = true
    error.value = null

    try {
      console.log('Fetching reviews for listing:', listingId)

      const q = query(
        collection(db, 'reviews'),
        where('listingId', '==', listingId)
      )

      const querySnapshot = await getDocs(q)
      const reviews = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        reviews.push({
          id: doc.id,
          reviewer: {
            name: data.reviewerName || 'Anonymous',
            avatar: data.reviewerAvatar || '/placeholder-user.jpg',
            rating: data.rating
          },
          rating: data.rating || 5,
          comment: data.comment || '',
          date: data.createdAt ? 
            new Date(data.createdAt.seconds * 1000).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            }) : 'Recently',
          createdAt: data.createdAt
        })
      })

      // Sort by creation date (newest first)
      reviews.sort((a, b) => {
        if (!a.createdAt && !b.createdAt) return 0
        if (!a.createdAt) return 1
        if (!b.createdAt) return -1
        return b.createdAt.seconds - a.createdAt.seconds
      })

      console.log(`Found ${reviews.length} reviews for listing ${listingId}`)
      return reviews
    } catch (err) {
      console.error('Error fetching listing reviews:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Calculate average rating for a user
  const getUserAverageRating = async (userId) => {
    try {
      const reviews = await getUserReviews(userId)
      
      if (reviews.length === 0) {
        return { average: 0, total: 0 }
      }

      const total = reviews.reduce((sum, review) => sum + review.rating, 0)
      const average = (total / reviews.length).toFixed(1)

      return {
        average: parseFloat(average),
        total: reviews.length
      }
    } catch (err) {
      console.error('Error calculating user average rating:', err)
      return { average: 0, total: 0 }
    }
  }

  return {
    loading,
    error,
    createReview,
    getUserReviews,
    getListingReviews,
    getUserAverageRating
  }
}
