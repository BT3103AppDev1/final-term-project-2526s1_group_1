<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Enhanced Header -->
    <header class="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link to="/browse" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <span class="text-white font-bold text-sm">PS</span>
              </div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PeerSwap</h1>
            </router-link>
            <!-- Breadcrumb -->
            <div class="hidden md:flex items-center gap-2 text-sm text-slate-500">
              <span>/</span>
              <span class="text-slate-700 font-medium">Messages</span>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <Button variant="outline" size="sm" as-child class="hidden sm:inline-flex">
              <router-link to="/rentals" class="flex items-center gap-2">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                Rentals
              </router-link>
            </Button>
            <Button variant="outline" size="sm" as-child>
              <router-link to="/profile" class="flex items-center gap-2">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span class="hidden sm:inline">Profile</span>
              </router-link>
            </Button>
          </div>
        </div>
      </div>
    </header>

    <!-- Enhanced Messages Layout -->
    <div class="container mx-auto px-4 py-6 h-[calc(100vh-88px)]">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        
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
        <div class="lg:col-span-2">
          <Card v-if="selectedConversation" class="h-full flex flex-col border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
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
                    <p v-else class="text-xs text-slate-500">Last seen recently</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <Button variant="outline" size="sm" class="hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors">
                    <Phone class="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" class="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors">
                    <Video class="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" class="hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors">
                    <Info class="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" class="hover:bg-slate-50 hover:border-slate-300 transition-colors">
                    <MoreVertical class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <!-- Enhanced Messages -->
            <CardContent ref="messagesContainer" class="flex-1 p-6 overflow-y-auto relative space-y-4">
              <div class="space-y-6">
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
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { Send, Search, MoreVertical, Phone, Video, Info } from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card.vue'
import Input from '@/components/ui/input.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar.vue'

// State
const selectedConversation = ref(null)
const newMessage = ref('')
const searchQuery = ref('')
const messagesContainer = ref(null)
const messages = ref([])

// Mock conversations (replace with Firebase later)
const mockConversations = ref([
  {
    id: "conv-1",
    user: {
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg?key=alex-msg",
      online: true,
    },
    lastMessage: {
      text: "Thanks! I'll pick it up tomorrow at 2 PM as discussed.",
      timestamp: "2 min ago",
      unread: false,
    },
    item: "Calculus Textbook - 8th Edition",
  },
  {
    id: "conv-2",
    user: {
      name: "Emma Davis",
      avatar: "/placeholder.svg?key=emma-msg",
      online: false,
    },
    lastMessage: {
      text: "Is the textbook still available for next week?",
      timestamp: "1 hour ago",
      unread: true,
    },
    item: "Engineering Mechanics Textbook",
  },
  {
    id: "conv-3",
    user: {
      name: "Mike Johnson",
      avatar: "/placeholder.svg?key=mike-msg",
      online: true,
    },
    lastMessage: {
      text: "Perfect! The laptop works great. Thanks again!",
      timestamp: "3 hours ago",
      unread: false,
    },
    item: "MacBook Pro 13-inch",
  },
  {
    id: "conv-4",
    user: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?key=sarah-msg",
      online: false,
    },
    lastMessage: {
      text: "I'm interested in renting your camera for the weekend",
      timestamp: "1 day ago",
      unread: true,
    },
    item: "Canon EOS R Camera",
  },
  {
    id: "conv-5",
    user: {
      name: "David Kim",
      avatar: "/placeholder.svg?key=david-msg",
      online: true,
    },
    lastMessage: {
      text: "Great condition! Would you consider $20 for 2 weeks?",
      timestamp: "2 days ago",
      unread: false,
    },
    item: "Wireless Headphones",
  },
])

// Mock messages for selected conversation
const mockMessages = {
  "conv-1": [
    {
      id: "msg-1",
      text: "Hi! I'm interested in renting your Calculus textbook.",
      timestamp: "Yesterday 10:30 AM",
      isMe: false,
    },
    {
      id: "msg-2",
      text: "Sure! It's available. When would you need it?",
      timestamp: "Yesterday 10:45 AM",
      isMe: true,
    },
    {
      id: "msg-3",
      text: "I need it for next week. Is $15/week okay?",
      timestamp: "Yesterday 11:00 AM",
      isMe: false,
    },
    {
      id: "msg-4",
      text: "That works! You can pick it up tomorrow at 2 PM.",
      timestamp: "Yesterday 11:15 AM",
      isMe: true,
    },
    {
      id: "msg-5",
      text: "Thanks! I'll pick it up tomorrow at 2 PM as discussed.",
      timestamp: "2 min ago",
      isMe: false,
    },
  ],
  "conv-2": [
    {
      id: "msg-6",
      text: "Is the textbook still available for next week?",
      timestamp: "1 hour ago",
      isMe: false,
    },
  ],
  "conv-3": [
    {
      id: "msg-7",
      text: "How's the laptop working out?",
      timestamp: "3 hours ago",
      isMe: true,
    },
    {
      id: "msg-8",
      text: "Perfect! The laptop works great. Thanks again!",
      timestamp: "3 hours ago",
      isMe: false,
    },
  ],
}

// Computed
const filteredConversations = computed(() => {
  if (!searchQuery.value) return mockConversations.value
  
  const query = searchQuery.value.toLowerCase()
  return mockConversations.value.filter(conv => 
    conv.user.name.toLowerCase().includes(query) ||
    conv.item.toLowerCase().includes(query) ||
    conv.lastMessage.text.toLowerCase().includes(query)
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

const selectConversation = (conversation) => {
  selectedConversation.value = conversation
  messages.value = mockMessages[conversation.id] || []
  
  // Mark as read
  conversation.lastMessage.unread = false
  
  // Scroll to bottom
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const handleSendMessage = () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return
  
  const message = {
    id: `msg-${Date.now()}`,
    text: newMessage.value.trim(),
    timestamp: "Just now",
    isMe: true,
  }
  
  messages.value.push(message)
  
  // Update last message in conversation
  selectedConversation.value.lastMessage = {
    text: message.text,
    timestamp: message.timestamp,
    unread: false,
  }
  
  newMessage.value = ''
  
  // Scroll to bottom
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