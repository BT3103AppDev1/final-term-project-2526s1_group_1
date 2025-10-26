import { ref } from 'vue'
import { db, auth } from '@/firebase/config'
import {collection,addDoc,doc,getDoc,getDocs,updateDoc,query,where,orderBy,onSnapshot,serverTimestamp
} from 'firebase/firestore'
import { useReviews } from '@/composables/useReviews'

export function useMessages() {
  const { getUserAverageRating } = useReviews()
  const loading = ref(false)
  const error = ref(null)
  const conversations = ref([])
  const messages = ref([])
  /**
   * Fetch all conversations for the current user,
   * and merge participant profile data from "User Information" collection.
   */
  const getConversations = async () => {
    loading.value = true
    error.value = null

    try {
      const currentUserId = auth.currentUser?.uid
      if (!currentUserId) throw new Error('User not logged in')

      // Query conversations that include the current user
      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', currentUserId),
        orderBy('lastMessageAt', 'desc')
      )

      const snapshot = await getDocs(q)

      // Merge participant info (excluding current user)
      const convos = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data()
          const otherUserId = data.participants.find(id => id !== currentUserId)

          let userData = { 
            name: 'Unknown', 
            avatar: '/placeholder.svg', 
            online: false, 
            lastSeen: null,
            rating: 0,
            reviewCount: 0
          }

          if (otherUserId) {
            const userRef = doc(db, 'User Information', otherUserId)
            const userSnap = await getDoc(userRef)

            if (userSnap.exists()) {
              const userInfo = userSnap.data()
              userData = {
                name: userInfo.name || 'Unknown User',
                avatar: userInfo.profileImageUrl || '/placeholder.svg',
                online: userInfo.online || false,
                lastSeen: userInfo.lastSeen || null,
                rating: userInfo.rating ?? 0,
                reviewCount: userInfo.reviewCount ?? 0
              }

              try {
                const { getUserAverageRating } = useReviews()
                const { average, total } = await getUserAverageRating(otherUserId)
                userData.rating = average ?? userData.rating
                userData.reviewCount = total ?? userData.reviewCount
              } catch (ratingErr) {
                console.warn(`⚠️ Failed to get rating for ${otherUserId}`, ratingErr)
              }
            }
          }

          return {
            id: docSnap.id,
            ...data,
            user: userData
          }
        })
      )

      conversations.value = convos
      return convos
    } catch (err) {
      console.error('getConversations Error:', err)
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Subscribe to real-time updates for a given conversation.
   * Automatically updates message list and triggers optional callback.
   */
  const subscribeToMessages = (conversationId, callback) => {
    const q = query(
      collection(db, 'conversations', conversationId, 'messages'),
      orderBy('createdAt', 'asc')
    )

    return onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      messages.value = msgs
      if (callback) callback(msgs)
    })
  }

  /**
   * Send a new message to a conversation and update its lastMessage field.
   */
  const sendMessage = async (conversationId, text) => {
    loading.value = true
    error.value = null

    try {
      const currentUser = auth.currentUser
      if (!currentUser) throw new Error('User not logged in')

      // Add the message
      await addDoc(
        collection(db, 'conversations', conversationId, 'messages'),
        {
          text,
          senderId: currentUser.uid,
          senderName: currentUser.displayName || 'Anonymous',
          createdAt: serverTimestamp()
        }
      )

      // Update conversation with last message preview
      const convoRef = doc(db, 'conversations', conversationId)
      await updateDoc(convoRef, {
        lastMessage: text,
        lastMessageAt: serverTimestamp()
      })
    } catch (err) {
      console.error('sendMessage Error:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  /*Create a new conversation (if it doesn’t already exist)between the current user and another participant.*/
  const createConversation = async (participantId, item) => {
  loading.value = true
  error.value = null

  try {
    const currentUser = auth.currentUser
    if (!currentUser) throw new Error('User not logged in')

    const existingQ = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', currentUser.uid)
    )
    const snapshot = await getDocs(existingQ)
    const existing = snapshot.docs.find(
      d => d.data().participants.includes(participantId)
    )

    let conversationRef
    if (existing) {
      conversationRef = doc(db, 'conversations', existing.id)
    } else {
      const docRef = await addDoc(collection(db, 'conversations'), {
        participants: [currentUser.uid, participantId],
        itemId: item.id,
        itemTitle: item.title,
        createdAt: serverTimestamp(),
        lastMessage: '',
        lastMessageAt: serverTimestamp()
      })
      conversationRef = docRef
    }

    const imageUrl =
      Array.isArray(item.images) && item.images.length > 0
        ? item.images[0]
        : '/placeholder.jpg'

    await addDoc(collection(db, `conversations/${conversationRef.id}/messages`), {
      senderId: currentUser.uid,
      senderName: currentUser.displayName || 'Anonymous',
      text: `Hi! I'm interested in your item: ${item.title}`,
      itemImage: imageUrl,
      createdAt: serverTimestamp()
    })

    await updateDoc(conversationRef, {
      lastMessage: `Hi! I'm interested in your item: ${item.title}`,
      lastMessageAt: serverTimestamp()
    })

    return conversationRef.id
  } catch (err) {
    console.error('createConversation Error:', err)
    error.value = err.message
    throw err
  } finally {
    loading.value = false
  }
}

  return {loading, error, conversations, messages, 
    getConversations, subscribeToMessages,sendMessage,createConversation
  }
}