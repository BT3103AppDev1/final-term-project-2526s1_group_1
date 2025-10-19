// src/composables/useListings.js
import { ref } from 'vue'
import { db, storage, auth } from '@/firebase/config'
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage'

export function useListings() {
  const loading = ref(false)
  const error = ref(null)

  const uploadImages = async (imageFiles) => {
    const uploadPromises = imageFiles.map(async (file) => {
      const fileName = `${Date.now()}_${file.name}`
      const imageRef = storageRef(storage, `listings/${fileName}`)
      await uploadBytes(imageRef, file)
      const downloadURL = await getDownloadURL(imageRef)
      return downloadURL
    })
    return await Promise.all(uploadPromises)
  }

  const createListing = async (listingData, imageFiles) => {
    loading.value = true
    error.value = null

    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to create listings')
      }

      console.log('Creating listing for user:', auth.currentUser.uid)
      console.log('Uploading', imageFiles.length, 'images')

      const imageUrls = await uploadImages(imageFiles)

      const docRef = await addDoc(collection(db, 'listings'), {
        ...listingData,
        images: imageUrls,
        ownerId: auth.currentUser.uid,
        ownerName: auth.currentUser.displayName || 'Anonymous',
        ownerEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'Available'
      })

      console.log('Listing created successfully with ID:', docRef.id)
      return docRef.id
    } catch (err) {
      console.error('Error creating listing:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getUserListings = async (userId = null) => {
    loading.value = true
    error.value = null

    try {
      // Use current user if no userId provided
      const targetUserId = userId || auth.currentUser?.uid
      
      if (!targetUserId) {
        throw new Error('User ID is required')
      }

      console.log('Fetching listings for user:', targetUserId)

      // Query listings where ownerId matches the target user
      const q = query(
        collection(db, 'listings'),
        where('ownerId', '==', targetUserId)
      )

      const querySnapshot = await getDocs(q)
      const listings = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        listings.push({
          id: doc.id,
          title: data.title || data.name || 'Untitled Item',
          description: data.description || 'No description available',
          price: data.price || 0,
          period: data.period || data.pricePer || 'day',
          category: data.category || 'Other',
          condition: data.condition || 'Good',
          location: data.location || 'Location not specified',
          image: data.images && data.images.length > 0 ? data.images[0] : '/placeholder.jpg',
          images: data.images || ['/placeholder.jpg'],
          available: data.status === 'active' || data.available !== false,
          owner: data.ownerName || 'User',
          rating: 4.5, // Default rating
          postedAt: data.createdAt ? 
            new Date(data.createdAt.seconds * 1000).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            }) : 'Recently posted',
          views: data.views || 0,
          favorites: data.favorites || 0,
          status: data.status || 'active',
          createdAt: data.createdAt
        })
      })

      // Sort by creation date in JavaScript (newest first)
      listings.sort((a, b) => {
        if (!a.createdAt && !b.createdAt) return 0
        if (!a.createdAt) return 1
        if (!b.createdAt) return -1
        return b.createdAt.seconds - a.createdAt.seconds
      })

      console.log(`Found ${listings.length} listings for user ${targetUserId}`)
      return listings
    } catch (err) {
      console.error('Error fetching user listings:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    createListing,
    getUserListings
  }
}
