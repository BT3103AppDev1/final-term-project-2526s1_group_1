// src/composables/useUserProfile.js
import { ref, computed } from 'vue'
import { db, auth } from '@/firebase/config'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

export function useUserProfile() {
  const loading = ref(false)
  const error = ref(null)
  const user = ref(null)
  const currentUser = ref(null)
  const authInitialized = ref(false)

  // Listen for auth state changes
  onAuthStateChanged(auth, (authUser) => {
    console.log('Auth state changed:', authUser ? authUser.email : 'No user')
    currentUser.value = authUser
    authInitialized.value = true
    
    if (authUser) {
      loadUserProfile(authUser.uid)
    } else {
      user.value = null
    }
  })

  // Load user profile from Firestore
  const loadUserProfile = async (userId = null) => {
    // Use current user's ID if no userId provided
    const targetUserId = userId || currentUser.value?.uid
    
    if (!targetUserId) {
      error.value = 'No user ID provided and no authenticated user found'
      loading.value = false
      return
    }
    
    console.log('Loading profile for user:', targetUserId)
    loading.value = true
    error.value = null
    
    try {
      // Wait for auth to be initialized if not already
      if (!authInitialized.value) {
        console.log('Waiting for auth to initialize...')
        await new Promise((resolve) => {
          const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            authInitialized.value = true
            unsubscribe()
            resolve()
          })
        })
      }

      // Check if user is authenticated before making request
      if (!currentUser.value) {
        throw new Error('User must be authenticated to access profiles')
      }

      // Use your existing collection name 'User Information'
      const userDocRef = doc(db, 'User Information', targetUserId)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        console.log('Profile found:', userDoc.data())
        const userData = userDoc.data()
        
        // Map your existing data structure to the new format
        user.value = {
          id: userDoc.id,
          name: userData.name || '',
          email: userData.email || currentUser.value?.email || '',
          avatar: userData.profileImageUrl || '',
          bio: userData.description || '',
          location: userData.location || '',
          skills: userData.skills || '',
          interests: userData.interests || '',
          shortBio: userData.shortBio || '',
          linkedin: userData.linkedin || '',
          instagram: userData.instagram || '',
          telegram: userData.telegram || '',
          verified: false,
          rating: userData.rating || 0,
          reviewCount: userData.reviewCount || 0,
          totalRentals: userData.totalRentals || 0,
          responseTime: userData.responseTime || 'Not set',
          joinedDate: userData.joinedDate || new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          }),
          stats: userData.stats || {
            itemsListed: 0,
            itemsRented: 0,
            totalEarnings: 0,
            successfulTransactions: 0,
          },
          // Keep your existing project arrays
          hostedProjects: userData.hostedProjects || [],
          currentProjects: userData.currentProjects || [],
          pastProjects: userData.pastProjects || [],
          savedProjects: userData.savedProjects || [],
          pendingProjects: userData.pendingProjects || []
        }
      } else {
        console.log('No profile found, creating default profile')
        // Create a default profile for new users
        await createDefaultProfile(targetUserId)
      }
    } catch (err) {
      console.error('Error loading user profile:', err)
      error.value = err?.message || err?.toString() || 'An unknown error occurred'
    } finally {
      loading.value = false
    }
  }

  // Create default profile for new users
  const createDefaultProfile = async (userId) => {
    console.log('Creating default profile for:', userId)
    const defaultProfile = {
      name: currentUser.value?.displayName || 'New User',
      email: currentUser.value?.email || '',
      profileImageUrl: currentUser.value?.photoURL || '',
      description: '',
      location: '',
      skills: '',
      interests: '',
      shortBio: '',
      linkedin: '',
      instagram: '',
      telegram: '',
      rating: 0,
      reviewCount: 0,
      totalRentals: 0,
      responseTime: 'Not set',
      joinedDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }),
      stats: {
        itemsListed: 0,
        itemsRented: 0,
        totalEarnings: 0,
        successfulTransactions: 0,
      },
      // Initialize project arrays
      hostedProjects: [],
      currentProjects: [],
      pastProjects: [],
      savedProjects: [],
      pendingProjects: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    try {
      // Use your existing collection name 'User Information'
      const userDocRef = doc(db, 'User Information', userId)
      await setDoc(userDocRef, defaultProfile)
      console.log('Default profile created successfully')
      
      // Map to new format for display
      user.value = {
        id: userId,
        name: defaultProfile.name,
        email: defaultProfile.email,
        avatar: defaultProfile.profileImageUrl,
        bio: defaultProfile.description,
        location: defaultProfile.location,
        skills: defaultProfile.skills,
        interests: defaultProfile.interests,
        shortBio: defaultProfile.shortBio,
        linkedin: defaultProfile.linkedin,
        instagram: defaultProfile.instagram,
        telegram: defaultProfile.telegram,
        verified: false,
        rating: defaultProfile.rating,
        reviewCount: defaultProfile.reviewCount,
        totalRentals: defaultProfile.totalRentals,
        responseTime: defaultProfile.responseTime,
        joinedDate: defaultProfile.joinedDate,
        stats: defaultProfile.stats,
        hostedProjects: defaultProfile.hostedProjects,
        currentProjects: defaultProfile.currentProjects,
        pastProjects: defaultProfile.pastProjects,
        savedProjects: defaultProfile.savedProjects,
        pendingProjects: defaultProfile.pendingProjects
      }
    } catch (err) {
      console.error('Error creating default profile:', err)
      error.value = err?.message || err?.toString() || 'An unknown error occurred'
    }
  }

  // Update user profile
  const updateUserProfile = async (profileData) => {
    if (!currentUser.value) {
      error.value = 'User must be authenticated'
      return false
    }

    loading.value = true
    error.value = null

    try {
      // Use your existing collection name 'User Information'
      const userDocRef = doc(db, 'User Information', currentUser.value.uid)
      
      // Map the new format back to your existing data structure
      const updateData = {
        name: profileData.name,
        profileImageUrl: profileData.avatar,
        description: profileData.bio,
        location: profileData.location,
        skills: profileData.skills || user.value.skills,
        interests: profileData.interests || user.value.interests,
        shortBio: profileData.shortBio || user.value.shortBio,
        linkedin: profileData.linkedin || user.value.linkedin,
        instagram: profileData.instagram || user.value.instagram,
        telegram: profileData.telegram || user.value.telegram,
        responseTime: profileData.responseTime,
        updatedAt: serverTimestamp()
      }

      await updateDoc(userDocRef, updateData)
      
      // Update local user data
      user.value = { 
        ...user.value, 
        name: profileData.name,
        avatar: profileData.avatar,
        bio: profileData.bio,
        location: profileData.location,
        responseTime: profileData.responseTime
      }
      
      return true
    } catch (err) {
      console.error('Error updating user profile:', err)
      error.value = err?.message || err?.toString() || 'An unknown error occurred'
      return false
    } finally {
      loading.value = false
    }
  }

  // Get user profile by ID (for viewing other users)
  const getUserProfileById = async (userId) => {
    loading.value = true
    error.value = null

    try {
      // Wait for auth to be initialized if not already
      if (!authInitialized.value) {
        console.log('Waiting for auth to initialize before loading profile...')
        await new Promise((resolve) => {
          const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            authInitialized.value = true
            unsubscribe()
            resolve()
          })
        })
      }

      // Check if user is authenticated before making request
      if (!currentUser.value) {
        throw new Error('User must be authenticated to view profiles')
      }

      // Use your existing collection name 'User Information'
      const userDocRef = doc(db, 'User Information', userId)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        
        // Map your existing data structure to the new format
        const mappedUser = {
          id: userDoc.id,
          name: userData.name || '',
          email: userData.email || '',
          avatar: userData.profileImageUrl || '',
          bio: userData.description || '',
          location: userData.location || '',
          skills: userData.skills || '',
          interests: userData.interests || '',
          shortBio: userData.shortBio || '',
          linkedin: userData.linkedin || '',
          instagram: userData.instagram || '',
          telegram: userData.telegram || '',
          verified: false,
          rating: userData.rating || 0,
          reviewCount: userData.reviewCount || 0,
          totalRentals: userData.totalRentals || 0,
          responseTime: userData.responseTime || 'Not set',
          joinedDate: userData.joinedDate || 'Recently',
          stats: userData.stats || {
            itemsListed: 0,
            itemsRented: 0,
            totalEarnings: 0,
            successfulTransactions: 0,
          },
          hostedProjects: userData.hostedProjects || [],
          currentProjects: userData.currentProjects || [],
          pastProjects: userData.pastProjects || [],
          savedProjects: userData.savedProjects || [],
          pendingProjects: userData.pendingProjects || []
        }
        
        user.value = mappedUser
        return mappedUser
      } else {
        throw new Error('User not found')
      }
    } catch (err) {
      console.error('Error getting user profile:', err)
      error.value = err?.message || err?.toString() || 'An unknown error occurred'
      return null
    } finally {
      loading.value = false
    }
  }

  // Check if current user is viewing their own profile
  const isOwnProfile = computed(() => {
    return currentUser.value && user.value && currentUser.value.uid === user.value.id
  })

  return {
    loading,
    error,
    user,
    currentUser,
    authInitialized,
    isOwnProfile,
    loadUserProfile,
    updateUserProfile,
    getUserProfileById
  }
}
