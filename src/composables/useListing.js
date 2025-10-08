import { ref } from 'vue'
import { db, storage, auth } from '@/firebase/config'
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore'
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'

export function useListings() {
  const loading = ref(false)
  const error = ref(null)

  // Upload images to Firebase Storage
  const uploadImages = async (imageFiles) => {
    const uploadPromises = imageFiles.map(async (file) => {
      const fileName = `${Date.now()}_${Math.random()}.${file.name.split('.').pop()}`
      const imageRef = storageRef(storage, `listings/${fileName}`)
      await uploadBytes(imageRef, file)
      return await getDownloadURL(imageRef)
    })
    
    return await Promise.all(uploadPromises)
  }

  // Create a new listing
  const createListing = async (listingData, imageFiles) => {
    loading.value = true
    error.value = null
    
    try {
      // Upload images first
      const imageUrls = await uploadImages(imageFiles)
      
      // Create listing document
      const docRef = await addDoc(collection(db, 'listings'), {
        title: listingData.title,
        category: listingData.category,
        condition: listingData.condition,
        description: listingData.description,
        price: listingData.price,
        period: listingData.period,
        location: listingData.location,
        availabilityNotes: listingData.availabilityNotes,
        images: imageUrls,
        ownerId: auth.currentUser.uid,
        ownerName: auth.currentUser.displayName || 'Anonymous',
        ownerEmail: auth.currentUser.email,
        status: 'active',
        available: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      return docRef.id
    } catch (err) {
      error.value = err.message
      console.error('Error creating listing:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get a single listing
  const getListing = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const docRef = doc(db, 'listings', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      } else {
        throw new Error('Listing not found')
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get all active listings
  const getActiveListings = async () => {
    loading.value = true
    error.value = null
    
    try {
      const q = query(
        collection(db, 'listings'),
        where('status', '==', 'active')
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

  // Update a listing
  const updateListing = async (id, updates) => {
    loading.value = true
    error.value = null
    
    try {
      const docRef = doc(db, 'listings', id)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete a listing
  const deleteListing = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const docRef = doc(db, 'listings', id)
      await deleteDoc(docRef)
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
    createListing,
    getListing,
    getActiveListings,
    updateListing,
    deleteListing
  }
}