// src/composables/useListings.js
import { ref } from 'vue'
import { db, storage, auth } from '@/firebase/config'
import {
  collection,
  addDoc,
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

  //Upload images to Firebase Storage
  const uploadImages = async (imageFiles) => {
    const uploadPromises = imageFiles.map(async (file) => {
      // Create a unique filename
      const fileName = `${Date.now()}_${file.name}`
      const imageRef = storageRef(storage, `listings/${fileName}`)

      // Upload the file
      await uploadBytes(imageRef, file)

      // Get the download URL
      const downloadURL = await getDownloadURL(imageRef)
      return downloadURL
    })

    return await Promise.all(uploadPromises)
  }

  // Create a new listing document in Firestore
  const createListing = async (listingData, imageFiles) => {
    loading.value = true
    error.value = null

    try {
      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to create listings')
      }

      console.log('Creating listing for user:', auth.currentUser.uid)
      console.log('Uploading', imageFiles.length, 'images')

      // Upload images first
      const imageUrls = await uploadImages(imageFiles)

      console.log('Images uploaded successfully:', imageUrls)

      // Add Firestore document
      const docRef = await addDoc(collection(db, 'listings'), {
        ...listingData,
        images: imageUrls,
        ownerId: auth.currentUser.uid,
        ownerEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active'
      })

      return docRef.id
    } catch (err) {
      console.error('Error creating listing:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    createListing
  }
}
