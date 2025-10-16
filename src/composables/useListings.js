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
        status: 'active'
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

  return {
    loading,
    error,
    createListing
  }
}
