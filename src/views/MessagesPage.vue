<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Enhanced Messages Layout -->
    <div class="container mx-auto px-4 py-6 max-h-screen h-screen flex flex-col">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        <!-- Enhanced Conversations List -->
        <div class="lg:col-span-1">
          <Card class="h-full flex flex-col border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-30"></div>
            <CardHeader class="pb-4 relative">
              <div class="flex items-center gap-3 mb-4">
                <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                </div>
                <CardTitle class="text-slate-900">Messages</CardTitle>
              </div>
              
              <div class="relative">
                <Search class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  v-model="searchQuery"
                  placeholder="Search conversations..."
                  class="pl-10 bg-white/60 border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
            </CardHeader>
            
            <CardContent class="flex-1 p-0 overflow-y-auto relative">
              <div class="space-y-1">
                <div
                  v-for="conversation in filteredConversations"
                  :key="conversation.id"
                  :class="[
                    'p-4 cursor-pointer transition-all duration-200 mx-2 rounded-xl hover:shadow-md',
                    selectedConversation?.id === conversation.id 
                      ? 'bg-gradient-to-r from-blue-100 to-purple-100 shadow-md border-2 border-blue-200' 
                      : 'hover:bg-white/60'
                  ]"
                  @click="selectConversation(conversation)"
                >
                  <div class="flex items-start gap-3">
                    <div class="relative">
                      <Avatar class="h-12 w-12 ring-2 ring-white shadow-sm">
                        <AvatarImage :src="conversation.user.avatar" />
                        <AvatarFallback class="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                          {{ getInitials(conversation.user.name) }}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        v-if="conversation.user.online"
                        class="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-green-500 border-2 border-white rounded-full shadow-sm"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between mb-1">
                        <h4 class="font-semibold text-slate-900 truncate">{{ conversation.user.name }}</h4>
                        <span class="text-xs text-slate-500 font-medium">
                          {{ conversation.lastMessage.timestamp }}
                        </span>
                      </div>
                      <p class="text-xs text-blue-600 font-medium mb-2 truncate">{{ conversation.item }}</p>
                      <div class="flex items-center justify-between">
                        <p
                          :class="[
                            'text-sm truncate',
                            conversation.lastMessage.unread
                              ? 'font-semibold text-slate-900'
                              : 'text-slate-600'
                          ]"
                        >
                          {{ conversation.lastMessage.text }}
                        </p>
                        <div
                          v-if="conversation.lastMessage.unread"
                          class="h-2.5 w-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full ml-2 shrink-0 shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Enhanced Chat Area -->
        <div class="lg:col-span-2 min-h-0">
          <Card v-if="selectedConversation" class="h-full flex flex-col border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden min-h-0">
            <div class="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50 opacity-30"></div>
            
            <!-- Enhanced Chat Header -->
            <CardHeader class="pb-4 relative border-b border-slate-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="relative">
                    <Avatar class="h-12 w-12 ring-2 ring-white shadow-lg">
                      <AvatarImage :src="selectedConversation.user.avatar" />
                      <AvatarFallback class="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {{ getInitials(selectedConversation.user.name) }}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      v-if="selectedConversation.user.online"
                      class="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-green-500 border-2 border-white rounded-full shadow-sm"
                    />
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-900">{{ selectedConversation.user.name }}</h3>
                    <p class="text-sm text-blue-600 font-medium">{{ selectedConversation.item }}</p>
                    <p v-if="selectedConversation.user.online" class="text-xs text-green-600 font-medium">Online now</p>
                    <p v-else class="text-xs text-slate-500">{{ getLastSeenText(selectedConversation.user.lastSeen) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <Button variant="outline" size="sm" class="hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors"
                  @click="showInfo = true">
                    <Info class="h-4 w-4" />
                  </Button>
                  <div class="relative">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      class="hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors"
                      @click="toggleMenu"
                    >
                      <MoreVertical class="h-4 w-4" />
                    </Button>
                    <div
                      v-if="showMenu"
                      class="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-50"
                    >
                      <button
                        class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md"
                        @click="goToProfile"
                      >
                        👤 View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <!-- Enhanced Messages -->
            <CardContent ref="messagesContainer" class="flex-1 p-6 overflow-y-auto relative">
              <div class="space-y-6 min-h-0">
                <div
                  v-for="message in messages"
                  :key="message.id"
                  :class="['flex', message.isMe ? 'justify-end' : 'justify-start']"
                >
                  <div :class="['max-w-[75%] flex gap-3', message.isMe ? 'flex-row-reverse' : 'flex-row']">
                    <Avatar v-if="!message.isMe" class="h-8 w-8 ring-1 ring-slate-200 shadow-sm">
                      <AvatarImage :src="selectedConversation.user.avatar" />
                      <AvatarFallback class="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {{ getInitials(selectedConversation.user.name) }}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div :class="['flex flex-col', message.isMe ? 'items-end' : 'items-start']">
                      <div
                        :class="[
                          'px-4 py-3 rounded-2xl shadow-sm max-w-full break-words',
                          message.isMe
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md'
                            : 'bg-white text-slate-900 border border-slate-200 rounded-bl-md'
                        ]"
                      >
                        <p class="text-sm leading-relaxed">{{ message.text }}</p>
                        <img
                          v-if="message.itemImage || message.imageUrl"
                          :src="message.itemImage || message.imageUrl"
                          alt="Item image"
                          class="mt-2 rounded-lg max-h-40 object-cover border border-slate-200"
                        />

                      </div>
                      <p
                        :class="[
                          'text-xs text-slate-500 mt-1 px-1',
                          message.isMe ? 'text-right' : 'text-left'
                        ]"
                      >
                        {{ message.timestamp }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <!-- Enhanced Message Input -->
            <div class="p-4 border-t border-slate-200 bg-white/60 relative">
              <div class="flex gap-3 items-end">
                <div class="flex-1">
                  <Input
                    v-model="newMessage"
                    placeholder="Type your message..."
                    class="bg-white border-slate-300 focus:border-blue-400 focus:ring-blue-400 rounded-xl px-4 py-3 text-sm resize-none"
                    @keypress.enter="handleSendMessage"
                  />
                </div>
                <Button 
                  @click="handleSendMessage" 
                  :disabled="!newMessage.trim()"
                  class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg rounded-xl px-4 py-3"
                >
                  <Send class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          <!-- Enhanced Empty State -->
          <Card v-else class="h-full flex items-center justify-center border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50 opacity-50"></div>
            <CardContent class="text-center relative">
              <div class="h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mx-auto mb-6 flex items-center justify-center">
                <svg class="h-12 w-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-slate-900 mb-3">Select a Conversation</h3>
              <p class="text-slate-600 max-w-sm">Choose a conversation from the sidebar to start messaging with other users about their items.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
<!-- Info Modal -->
<template v-if="showInfo">
  <div 
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    @click.self="showInfo = false"
  >
    <div class="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm text-center">
      <h2 class="text-xl font-semibold text-slate-900 mb-2">User Info</h2>
      <p class="text-slate-700">
        ⭐ Rating:
        <span class="font-semibold">
          {{ selectedConversation?.user?.rating?.toFixed?.(1) || '4.5' }}
        </span>
      </p>

      <p class="text-slate-700 mb-6">
        📝 Reviews:
        <span class="font-semibold">
          {{ selectedConversation?.user?.reviewCount || 0 }}
        </span>
      </p>
      <Button 
        variant="outline" 
        class="w-full"
        @click="showInfo = false"
      >
        Close
      </Button>
    </div>
  </div>
</template>

</template>

<script setup>
import { onMounted } from 'vue'
import { useMessages } from '@/composables/useMessages'
import { auth } from '@/firebase/config'
import { ref, computed, nextTick } from 'vue'
import { Send, Search, MoreVertical, Info } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card.vue'
import Input from '@/components/ui/input.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar.vue'
import { useRoute, useRouter } from 'vue-router'

// State
const showInfo = ref(false)
const selectedConversation = ref(null)
const newMessage = ref('')
const searchQuery = ref('')
const messagesContainer = ref(null)
const messages = ref([])
const showMenu = ref(false) 

const { getConversations, subscribeToMessages, sendMessage } = useMessages()

const conversations = ref([])
const loading = ref(false)
const currentUserId = ref(null)
const route = useRoute()
const router = useRouter()  

const toggleMenu = () => {  
  showMenu.value = !showMenu.value
}

const goToProfile = () => {
  const userId =
    selectedConversation.value?.user?.id ||
    selectedConversation.value?.otherUserId ||
    (selectedConversation.value?.participants?.find?.(
      id => id !== currentUserId.value
    ))

  if (userId) {
    router.push(`/profile/${userId}`)
  } else {
    alert('Profile not available.')
  }

  showMenu.value = false
}

onMounted(async () => {
  loading.value = true
  currentUserId.value = auth.currentUser.uid
  conversations.value = await getConversations()
  loading.value = false

  const chatId = route.query.chatId
  if (chatId) {
    const targetConv = conversations.value.find(c => c.id === chatId)
    if (targetConv) {
      selectConversation(targetConv)
    } else {
      setTimeout(() => {
        const conv = conversations.value.find(c => c.id === chatId)
        if (conv) selectConversation(conv)
      }, 800)
    }
  }
})
// Computed
const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value
  
  const query = searchQuery.value.toLowerCase()
    return conversations.value.filter(conv =>
    (conv.itemTitle || '').toLowerCase().includes(query) ||
    (conv.user?.name || '').toLowerCase().includes(query)
  )
})


// Methods
const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

const getLastSeenText = (lastSeen) => {
  if (!lastSeen) return 'Last seen recently'
  
  const now = new Date()
  const lastSeenDate = lastSeen.toDate ? lastSeen.toDate() : new Date(lastSeen)
  const diffMs = now - lastSeenDate
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMinutes < 1) {
    return 'Last seen just now'
  } else if (diffMinutes < 60) {
    return `Last seen ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
  } else if (diffHours < 24) {
    return `Last seen ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  } else if (diffDays < 7) {
    return `Last seen ${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  } else {
    return `Last seen ${lastSeenDate.toLocaleDateString()}`
  }
}

const selectConversation = (conversation) => {
  selectedConversation.value = conversation
  messages.value = [] 
  subscribeToMessages(conversation.id, (msgs) => {
    messages.value = msgs.map(m => ({
      id: m.id,
      text: m.text,
      itemImage: m.itemImage || m.imageUrl || '',
      timestamp: m.createdAt?.toDate?.()?.toLocaleString() || '',
      isMe: m.senderId === currentUserId.value
    }))
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  })
}

const handleSendMessage = async () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return
  
  await sendMessage(selectedConversation.value.id, newMessage.value.trim())
  newMessage.value = ''
  
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}
</script>

<style scoped>
/* Custom scrollbar for messages */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>