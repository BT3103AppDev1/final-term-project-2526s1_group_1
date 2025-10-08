import { ref } from 'vue'
import { db, auth } from '@/firebase/config'
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs
} from 'firebase/firestore'

export function useMessages() {
  const loading = ref(false)
  const error = ref(null)
  const conversations = ref([])
  const messages = ref([])

  // Get all conversations for current user
  const getConversations = async () => {
    loading.value = true
    error.value = null

    try {
      if (!auth.currentUser) {
        throw new Error('You must be logged in')
      }

      // Get conversations where user is participant
      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', auth.currentUser.uid),
        orderBy('lastMessageAt', 'desc')
      )

      const querySnapshot = await getDocs(q)
      conversations.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      return conversations.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Subscribe to real-time messages for a conversation
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

  // Send a message
  const sendMessage = async (conversationId, messageText) => {
    loading.value = true
    error.value = null

    try {
      if (!auth.currentUser) {
        throw new Error('You must be logged in')
      }

      // Add message to conversation
      await addDoc(
        collection(db, 'conversations', conversationId, 'messages'),
        {
          text: messageText,
          senderId: auth.currentUser.uid,
          senderName: auth.currentUser.displayName,
          createdAt: serverTimestamp()
        }
      )

      // Update conversation's last message
      // (You'd use updateDoc here to update the conversation document)

    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create a new conversation
  const createConversation = async (participantId, itemId, itemTitle) => {
    loading.value = true
    error.value = null

    try {
      if (!auth.currentUser) {
        throw new Error('You must be logged in')
      }

      const docRef = await addDoc(collection(db, 'conversations'), {
        participants: [auth.currentUser.uid, participantId],
        itemId: itemId,
        itemTitle: itemTitle,
        lastMessage: '',
        lastMessageAt: serverTimestamp(),
        createdAt: serverTimestamp()
      })

      return docRef.id
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
    conversations,
    messages,
    getConversations,
    subscribeToMessages,
    sendMessage,
    createConversation
  }
}