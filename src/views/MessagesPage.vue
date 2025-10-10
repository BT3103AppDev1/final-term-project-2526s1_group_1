<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/browse" class="flex items-center gap-2">
            <div class="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span class="text-primary-foreground font-bold text-sm">PS</span>
            </div>
            <h1 class="text-xl font-bold text-foreground">PeerSwap</h1>
          </router-link>
          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" as-child>
              <router-link to="/rentals">Rentals</router-link>
            </Button>
            <Button variant="outline" size="sm" as-child>
              <router-link to="/profile">Profile</router-link>
            </Button>
          </div>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 py-6 h-[calc(100vh-88px)]">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <!-- Conversations List -->
        <div class="lg:col-span-1">
          <Card class="h-full flex flex-col">
            <CardHeader class="pb-4">
              <CardTitle>Messages</CardTitle>
              <div class="relative">
                <Search class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  v-model="searchQuery"
                  placeholder="Search conversations..."
                  class="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent class="flex-1 p-0 overflow-y-auto">
              <div class="space-y-1">
                <div
                  v-for="conversation in filteredConversations"
                  :key="conversation.id"
                  :class="[
                    'p-4 cursor-pointer hover:bg-muted/50 transition-colors',
                    selectedConversation?.id === conversation.id ? 'bg-muted' : ''
                  ]"
                  @click="selectConversation(conversation)"
                >
                  <div class="flex items-start gap-3">
                    <div class="relative">
                      <Avatar class="h-10 w-10">
                        <AvatarImage :src="conversation.user.avatar" />
                        <AvatarFallback>
                          {{ getInitials(conversation.user.name) }}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        v-if="conversation.user.online"
                        class="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between mb-1">
                        <h4 class="font-semibold text-sm truncate">{{ conversation.user.name }}</h4>
                        <span class="text-xs text-muted-foreground">
                          {{ conversation.lastMessage.timestamp }}
                        </span>
                      </div>
                      <p class="text-xs text-muted-foreground mb-1 truncate">{{ conversation.item }}</p>
                      <div class="flex items-center justify-between">
                        <p
                          :class="[
                            'text-sm truncate',
                            conversation.lastMessage.unread
                              ? 'font-semibold text-foreground'
                              : 'text-muted-foreground'
                          ]"
                        >
                          {{ conversation.lastMessage.text }}
                        </p>
                        <div
                          v-if="conversation.lastMessage.unread"
                          class="h-2 w-2 bg-primary rounded-full ml-2 shrink-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Chat Area -->
        <div class="lg:col-span-2">
          <Card v-if="selectedConversation" class="h-full flex flex-col">
            <!-- Chat Header -->
            <CardHeader class="pb-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="relative">
                    <Avatar class="h-10 w-10">
                      <AvatarImage :src="selectedConversation.user.avatar" />
                      <AvatarFallback>
                        {{ getInitials(selectedConversation.user.name) }}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      v-if="selectedConversation.user.online"
                      class="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full"
                    />
                  </div>
                  <div>
                    <h3 class="font-semibold">{{ selectedConversation.user.name }}</h3>
                    <p class="text-sm text-muted-foreground">{{ selectedConversation.item }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Phone class="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video class="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Info class="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <Separator />

            <!-- Messages -->
            <CardContent ref="messagesContainer" class="flex-1 p-4 overflow-y-auto">
              <div class="space-y-4">
                <div
                  v-for="message in messages"
                  :key="message.id"
                  :class="['flex', message.isMe ? 'justify-end' : 'justify-start']"
                >
                  <div :class="['max-w-[70%]', message.isMe ? 'order-2' : 'order-1']">
                    <div
                      :class="[
                        'p-3 rounded-lg',
                        message.isMe
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted text-foreground'
                      ]"
                    >
                      <p class="text-sm">{{ message.text }}</p>
                    </div>
                    <p
                      :class="[
                        'text-xs text-muted-foreground mt-1',
                        message.isMe ? 'text-right' : 'text-left'
                      ]"
                    >
                      {{ message.timestamp }}
                    </p>
                  </div>
                  <Avatar v-if="!message.isMe" class="h-8 w-8 order-1 mr-2 mt-1">
                    <AvatarImage :src="selectedConversation.user.avatar" />
                    <AvatarFallback class="text-xs">
                      {{ getInitials(selectedConversation.user.name) }}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </CardContent>

            <Separator />

            <!-- Message Input -->
            <div class="p-4">
              <div class="flex gap-2">
                <Input
                  v-model="newMessage"
                  placeholder="Type a message..."
                  class="flex-1"
                  @keypress.enter="handleSendMessage"
                />
                <Button @click="handleSendMessage" :disabled="!newMessage.trim()">
                  <Send class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          <!-- No conversation selected -->
          <Card v-else class="h-full flex items-center justify-center">
            <CardContent class="text-center">
              <p class="text-muted-foreground">Select a conversation to start messaging</p>
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
import Avatar from '@/components/ui/Avatar.vue'
import Separator from '@/components/ui/separator.vue'

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
      text: "The MacBook is ready for pickup. Let me know when you're coming.",
      timestamp: "3 hours ago",
      unread: false,
    },
    item: 'MacBook Pro 13" (2021)',
  },
])

// Mock messages for active conversation
const mockMessages = {
  "conv-1": [
    {
      id: "msg-1",
      sender: "Alex Rodriguez",
      text: "Hi! I'm interested in renting your Calculus textbook. Is it still available?",
      timestamp: "Yesterday 3:45 PM",
      isMe: false,
    },
    {
      id: "msg-2",
      sender: "You",
      text: "Yes, it's available! When would you need it?",
      timestamp: "Yesterday 4:12 PM",
      isMe: true,
    },
    {
      id: "msg-3",
      sender: "Alex Rodriguez",
      text: "I need it starting Monday for about a week. Would that work?",
      timestamp: "Yesterday 4:15 PM",
      isMe: false,
    },
    {
      id: "msg-4",
      sender: "You",
      text: "Perfect! That works for me. The rental is $15 for the week plus a $50 security deposit. We can meet at the Campus North library.",
      timestamp: "Yesterday 4:20 PM",
      isMe: true,
    },
    {
      id: "msg-5",
      sender: "Alex Rodriguez",
      text: "Sounds great! I'll send the rental request through the app. What time works best for pickup?",
      timestamp: "Today 10:30 AM",
      isMe: false,
    },
    {
      id: "msg-6",
      sender: "You",
      text: "I'm free tomorrow (Tuesday) between 2-4 PM. Does 2 PM work for you?",
      timestamp: "Today 11:15 AM",
      isMe: true,
    },
    {
      id: "msg-7",
      sender: "Alex Rodriguez",
      text: "Thanks! I'll pick it up tomorrow at 2 PM as discussed.",
      timestamp: "2 min ago",
      isMe: false,
    },
  ],
  "conv-2": [
    {
      id: "msg-8",
      sender: "Emma Davis",
      text: "Is the textbook still available for next week?",
      timestamp: "1 hour ago",
      isMe: false,
    },
  ],
  "conv-3": [
    {
      id: "msg-9",
      sender: "Mike Johnson",
      text: "The MacBook is ready for pickup. Let me know when you're coming.",
      timestamp: "3 hours ago",
      isMe: false,
    },
  ],
}

// Computed
const filteredConversations = computed(() => {
  return mockConversations.value.filter(
    (conv) =>
      conv.user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      conv.item.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Methods
const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
}

const selectConversation = (conversation) => {
  selectedConversation.value = conversation
  messages.value = mockMessages[conversation.id] || []
  
  // Mark as read
  conversation.lastMessage.unread = false
  
  // Scroll to bottom
  nextTick(() => {
    scrollToBottom()
  })
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const handleSendMessage = () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return

  const newMsg = {
    id: `msg-${Date.now()}`,
    sender: 'You',
    text: newMessage.value,
    timestamp: 'Just now',
    isMe: true,
  }

  messages.value.push(newMsg)
  
  // Update last message in conversation
  selectedConversation.value.lastMessage = {
    text: newMessage.value,
    timestamp: 'Just now',
    unread: false,
  }

  console.log('Sending message:', newMessage.value)
  
  // In real app: Send to Firebase
  // await sendMessage(selectedConversation.value.id, newMessage.value)

  newMessage.value = ''
  
  nextTick(() => {
    scrollToBottom()
  })
}

// Initialize with first conversation selected
if (mockConversations.value.length > 0) {
  selectConversation(mockConversations.value[0])
}
</script>

<style scoped>
/* Custom scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
</style>