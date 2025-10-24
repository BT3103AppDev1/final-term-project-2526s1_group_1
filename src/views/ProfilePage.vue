<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-12">
      <div class="flex flex-col items-center justify-center min-h-[400px]">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-slate-600 text-lg">Loading profile...</p>
      </div>
    </div>
    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-12">
      <div class="max-w-md mx-auto text-center">
        <div class="p-6 rounded-2xl bg-red-50 border border-red-200 shadow-sm">
          <div class="h-12 w-12 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-red-900 mb-2">Profile Error</h3>
          <p class="text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- No User State -->
    <div v-else-if="!user" class="container mx-auto px-4 py-12">
      <div class="max-w-md mx-auto text-center">
        <div class="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div class="h-16 w-16 rounded-full bg-slate-100 mx-auto mb-6 flex items-center justify-center">
            <svg class="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-slate-900 mb-3">No Profile Found</h3>
          <p class="text-slate-600 mb-6">We couldn't find this user profile. Please make sure you're logged in.</p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <Button as-child class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <router-link to="/auth">Login</router-link>
            </Button>
            <Button variant="outline" @click="debugCreateProfile">
              Create Profile (Debug)
            </Button>
          </div>
          <div class="mt-6 pt-6 border-t border-slate-200">
            <p class="text-sm text-slate-500">Current User: {{ currentUser?.email || 'Not logged in' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Profile Content -->
    <div v-else class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Enhanced Profile Sidebar -->
        <div class="lg:col-span-1">
          <Card class="sticky top-8 overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"></div>
            <CardContent class="relative p-6">
              <!-- Profile Header -->
              <div class="text-center mb-6">
                <div class="relative inline-block mb-4">
                  <div class="h-28 w-28 mx-auto ring-4 ring-white shadow-lg rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <img v-if="user.avatar" :key="`avatar-${user.id}-${user.avatar}`" :src="user.avatar" class="w-full h-full object-cover" alt="Profile picture" @error="handleImageError"/>
                    <span v-else class="text-white text-2xl font-bold"> {{ getInitials(user.name) }}</span>
                  </div>
                  <div v-if="user.verified" class="absolute -bottom-1 -right-1 h-8 w-8 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-white">
                    <Shield class="h-4 w-4 text-white" />
                  </div>
                </div>
                
                <div class="space-y-2">
                  <div class="flex items-center justify-center gap-2">
                    <h2 class="text-2xl font-bold text-slate-900">{{ user.name }}</h2>
                    <Badge v-if="user.verified" variant="secondary" class="text-xs bg-green-100 text-green-800 border-green-200">
                      Verified
                    </Badge>
                  </div>
                  
                  <!-- Rating -->
                  <div class="flex items-center justify-center gap-2">
                    <div class="flex items-center gap-1">
                      <Star v-for="i in 5" :key="i" :class="i <= Math.floor(user.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'"
                          class="h-4 w-4" />
                    </div>
                    <span class="font-semibold text-slate-900">{{ user.rating || 0 }}</span>
                    <span class="text-slate-500">({{ user.reviewCount || 0 }})</span>
                  </div>
                  
                  <!-- Location -->
                  <div class="flex items-center justify-center gap-2 text-slate-600">
                    <MapPin class="h-4 w-4" />
                    <span>{{ user.location || 'Location not set' }}</span>
                  </div>
                </div>
                
                <!-- Edit Profile Button -->
                <div v-if="isOwnProfile" class="mt-4">
                  <Button variant="outline" size="sm" as-child class="w-full">
                    <router-link to="/edit-profile" class="flex items-center justify-center gap-2">
                      <Edit class="h-4 w-4" />
                      Edit Profile
                    </router-link>
                  </Button>
                </div>
              </div>

              <Separator class="my-6 bg-slate-200" />

              <!-- Profile Stats -->
              <div class="space-y-4 text-sm">
                <div class="bg-white/60 rounded-lg p-4 space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-slate-600">Member since</span>
                    <span class="font-semibold text-slate-900">{{ user.joinedDate }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-slate-600">Response time</span>
                    <span class="font-semibold text-slate-900">{{ user.responseTime || 'Not set' }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-slate-600">Total rentals</span>
                    <span class="font-semibold text-slate-900">{{ user.totalRentals || 0 }}</span>
                  </div>
                </div>
              </div>

              <Separator class="my-6 bg-slate-200" />

              <!-- Action Buttons -->
              <div class="space-y-3" v-if="!isOwnProfile">
                <Button class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg" size="sm" @click="sendMessage">
                  <MessageCircle class="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" class="w-full border-slate-300 hover:bg-slate-50" size="sm" @click="toggleFollow">
                  <Heart :class="isFollowing ? 'fill-red-500 text-red-500' : ''" class="h-4 w-4 mr-2" />
                  {{ isFollowing ? 'Following' : 'Follow' }}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Enhanced Main Content -->
        <div class="lg:col-span-3">
          <Tabs v-model="activeTab" class="space-y-8">
            <TabsList class="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-sm border border-slate-200 p-1 rounded-xl">
              <TabsTrigger value="overview" class="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all">
                Overview
              </TabsTrigger>
              <TabsTrigger value="listings" class="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all">
                Listings ({{ userItems.length }})
              </TabsTrigger>
              <TabsTrigger value="reviews" class="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all">
                Reviews ({{ reviews.length }})
              </TabsTrigger>
              <TabsTrigger value="stats" class="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all">
                Stats
              </TabsTrigger>
            </TabsList>

            <!-- Enhanced Overview Tab -->
            <TabsContent value="overview" class="space-y-8">
              <!-- About Section -->
              <Card class="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50 opacity-30"></div>
                <CardHeader class="relative">
                  <CardTitle class="flex items-center gap-2 text-slate-900">
                    <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>
                    About {{ user.name }}
                  </CardTitle>
                </CardHeader>
                <CardContent class="relative">
                  <div class="space-y-6">
                    <div v-if="user.shortBio" class="bg-white/60 rounded-xl p-4">
                      <h4 class="font-semibold text-sm text-slate-600 mb-2 uppercase tracking-wide">Bio</h4>
                      <p class="text-slate-900 leading-relaxed">{{ user.shortBio }}</p>
                    </div>
                    
                    <div v-if="user.bio" class="bg-white/60 rounded-xl p-4">
                      <h4 class="font-semibold text-sm text-slate-600 mb-2 uppercase tracking-wide">Description</h4>
                      <p class="text-slate-900 leading-relaxed">{{ user.bio }}</p>
                    </div>
                    
                    <div v-if="user.skills" class="bg-white/60 rounded-xl p-4">
                      <h4 class="font-semibold text-sm text-slate-600 mb-3 uppercase tracking-wide">Skills</h4>
                      <div class="flex flex-wrap gap-2">
                        <Badge 
                          v-for="skill in user.skills.split(', ')" 
                          :key="skill" 
                          class="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 transition-colors"
                        >
                          {{ skill.trim() }}
                        </Badge>
                      </div>
                    </div>
                    
                    <div v-if="user.interests" class="bg-white/60 rounded-xl p-4">
                      <h4 class="font-semibold text-sm text-slate-600 mb-3 uppercase tracking-wide">Interests</h4>
                      <div class="flex flex-wrap gap-2">
                        <Badge 
                          v-for="interest in user.interests.split(', ')" 
                          :key="interest" 
                          variant="outline"
                          class="border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors"
                        >
                          {{ interest.trim() }}
                        </Badge>
                      </div>
                    </div>

                    <div v-if="user.linkedin || user.instagram || user.telegram" class="bg-white/60 rounded-xl p-4">
                      <h4 class="font-semibold text-sm text-slate-600 mb-3 uppercase tracking-wide">Social Media</h4>
                      <div class="flex gap-4">
                        <a v-if="user.linkedin" :href="user.linkedin" target="_blank" 
                           class="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm">
                          LinkedIn
                        </a>
                        <a v-if="user.instagram" :href="user.instagram" target="_blank"
                           class="flex items-center gap-2 px-3 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition-colors text-sm">
                          Instagram
                        </a>
                        <a v-if="user.telegram" :href="user.telegram" target="_blank"
                           class="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm">
                          Telegram
                        </a>
                      </div>
                    </div>

                    <div v-if="!user.shortBio && !user.bio && !user.skills && !user.interests" class="text-center py-8">
                      <div class="h-16 w-16 rounded-full bg-slate-100 mx-auto mb-4 flex items-center justify-center">
                        <svg class="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <p class="text-slate-500 italic">No information available yet.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Recent Listings -->
              <Card class="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-slate-50 to-green-50 opacity-30"></div>
                <CardHeader class="relative">
                  <div class="flex items-center justify-between">
                    <CardTitle class="flex items-center gap-2 text-slate-900">
                      <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                      </div>
                      Recent Listings
                    </CardTitle>
                    <CardDescription class="text-slate-600">Latest items from {{ user.name }}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent class="relative">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ItemCard
                      v-for="item in userItems.slice(0, 2)"
                      :key="item.id"
                      :item="item"
                      class="transform hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </CardContent>
              </Card>

              <!-- Recent Reviews -->
              <Card class="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-slate-50 to-amber-50 opacity-30"></div>
                <CardHeader class="relative">
                  <CardTitle class="flex items-center gap-2 text-slate-900">
                    <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Star class="h-4 w-4 text-white fill-current" />
                    </div>
                    Recent Reviews
                  </CardTitle>
                  <CardDescription class="text-slate-600">What others are saying</CardDescription>
                </CardHeader>
                <CardContent class="relative">
                  <div class="space-y-4">
                    <ReviewCard
                      v-for="review in reviews.slice(0, 2)"
                      :key="review.id"
                      :review="review"
                      class="bg-white/60 rounded-xl"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <!-- Enhanced Listings Tab -->
            <TabsContent value="listings" class="space-y-8">
              <div class="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-0">
                <div>
                  <h3 class="text-2xl font-bold text-slate-900 mb-2">My Listings</h3>
                  <p class="text-slate-600">Manage and view your posted items</p>
                </div>
                <Button as-child class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg">
                  <router-link to="/list-item" class="flex items-center gap-2">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Add New Item
                  </router-link>
                </Button>
              </div>
              
              <!-- Loading State -->
              <div v-if="itemsLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="n in 4" :key="n" class="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-0 animate-pulse">
                  <div class="h-48 bg-slate-200 rounded-lg mb-4"></div>
                  <div class="h-4 bg-slate-200 rounded mb-2"></div>
                  <div class="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
              </div>

              <!-- User Items Grid -->
              <div v-else-if="userItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="item in userItems" :key="item.id" class="relative group">
                  <ItemCard :item="item" class="transform hover:scale-105 transition-all duration-200 shadow-lg" />
                  <!-- Stats Overlay -->
                  <div class="absolute top-3 left-3 flex gap-2">
                    <Badge class="bg-white/90 text-slate-700 border-0 shadow-sm">
                      <Eye class="h-3 w-3 mr-1" />
                      {{ item.views || 0 }}
                    </Badge>
                    <Badge class="bg-white/90 text-slate-700 border-0 shadow-sm">
                      <Heart class="h-3 w-3 mr-1" />
                      {{ item.favorites || 0 }}
                    </Badge>
                  </div>
                  <!-- Status Indicator -->
                  <div class="absolute top-3 right-3">
                    <div class="h-3 w-3 rounded-full bg-green-500 ring-2 ring-white shadow-sm"></div>
                  </div>
                </div>
              </div>
              
              <!-- Empty State -->
              <div v-else-if="!itemsLoading && userItems.length === 0" class="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl border-0 shadow-lg">
                <div class="h-20 w-20 rounded-full bg-slate-100 mx-auto mb-6 flex items-center justify-center">
                  <svg class="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-slate-900 mb-3">No listings yet</h3>
                <p class="text-slate-600 mb-6">Start sharing items with your community!</p>
                <Button as-child class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <router-link to="/list-item">Create First Listing</router-link>
                </Button>
              </div>
            </TabsContent>

            <!-- Enhanced Reviews Tab -->
            <TabsContent value="reviews" class="space-y-8">
              <div class="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-0">
                <div>
                  <h3 class="text-2xl font-bold text-slate-900 mb-2">Reviews & Ratings</h3>
                  <p class="text-slate-600">See what others say about your service</p>
                </div>
                <div class="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 rounded-xl">
                  <Star class="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <div class="text-right">
                    <div class="text-2xl font-bold text-slate-900">{{ user.rating || 0 }}</div>
                    <div class="text-sm text-slate-600">{{ user.reviewCount || 0 }} reviews</div>
                  </div>
                </div>
              </div>
              
              <!-- Loading State -->
              <div v-if="reviewsLoading" class="space-y-6">
                <div v-for="n in 3" :key="n" class="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-0 animate-pulse">
                  <div class="flex items-start gap-4">
                    <div class="h-12 w-12 bg-slate-200 rounded-full"></div>
                    <div class="flex-1 space-y-2">
                      <div class="h-4 bg-slate-200 rounded w-1/4"></div>
                      <div class="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div class="h-4 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Reviews List -->
              <div v-else-if="reviews.length > 0" class="space-y-6">
                <ReviewCard
                  v-for="review in reviews"
                  :key="review.id"
                  :review="review"
                  class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0 transform hover:scale-[1.02] transition-all duration-200"
                />
              </div>
              
              <!-- Empty State -->
              <div v-else-if="!reviewsLoading && reviews.length === 0" class="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl border-0 shadow-lg">
                <div class="h-20 w-20 rounded-full bg-amber-100 mx-auto mb-6 flex items-center justify-center">
                  <Star class="h-10 w-10 text-amber-500" />
                </div>
                <h3 class="text-xl font-semibold text-slate-900 mb-3">No reviews yet</h3>
                <p class="text-slate-600">Complete transactions to start receiving reviews!</p>
              </div>
            </TabsContent>

            <!-- Enhanced Stats Tab -->
            <TabsContent value="stats" class="space-y-8">
              <!-- Stats Overview -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card class="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden group hover:shadow-xl transition-all duration-200">
                  <CardContent class="p-6 text-center relative">
                    <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div class="relative">
                      <div class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mx-auto mb-3 flex items-center justify-center">
                        <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                      </div>
                      <div class="text-3xl font-bold text-blue-900 mb-1">
                        {{ user.stats?.itemsListed || 0 }}
                      </div>
                      <p class="text-sm text-blue-700 font-medium">Items Listed</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card class="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden group hover:shadow-xl transition-all duration-200">
                  <CardContent class="p-6 text-center relative">
                    <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div class="relative">
                      <div class="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mx-auto mb-3 flex items-center justify-center">
                        <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <div class="text-3xl font-bold text-green-900 mb-1">
                        {{ user.stats?.itemsRented || 0 }}
                      </div>
                      <p class="text-sm text-green-700 font-medium">Items Rented</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card class="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-100 overflow-hidden group hover:shadow-xl transition-all duration-200">
                  <CardContent class="p-6 text-center relative">
                    <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div class="relative">
                      <div class="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mx-auto mb-3 flex items-center justify-center">
                        <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                        </svg>
                      </div>
                      <div class="text-3xl font-bold text-purple-900 mb-1">
                        ${{ user.stats?.totalEarnings || 0 }}
                      </div>
                      <p class="text-sm text-purple-700 font-medium">Total Earnings</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card class="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-100 overflow-hidden group hover:shadow-xl transition-all duration-200">
                  <CardContent class="p-6 text-center relative">
                    <div class="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div class="relative">
                      <div class="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 mx-auto mb-3 flex items-center justify-center">
                        <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                      </div>
                      <div class="text-3xl font-bold text-amber-900 mb-1">
                        {{ user.stats?.successfulTransactions || 0 }}
                      </div>
                      <p class="text-sm text-amber-700 font-medium">Successful Deals</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <!-- Performance Overview -->
              <Card class="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-slate-50 to-indigo-50 opacity-50"></div>
                <CardHeader class="relative">
                  <CardTitle class="flex items-center gap-2 text-slate-900">
                    <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      </svg>
                    </div>
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent class="relative">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Performance Metrics -->
                    <div class="space-y-6">
                      <div class="bg-white/60 rounded-xl p-4">
                        <div class="flex justify-between items-center mb-2">
                          <span class="text-slate-600 font-medium">Response Rate</span>
                          <span class="font-bold text-green-600">{{responseRatePercentage}}%</span>
                        </div>
                        <div class="w-full bg-slate-200 rounded-full h-2">
                          <div class="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" :style="`width: ${responseRatePercentage}%`"></div>
                        </div>
                      </div>
                      
                      <div class="bg-white/60 rounded-xl p-4">
                        <div class="flex justify-between items-center mb-2">
                          <span class="text-slate-600 font-medium">On-time Delivery</span>
                          <span class="font-bold text-blue-600">{{completionRatePercentage}}%</span>
                        </div>
                        <div class="w-full bg-slate-200 rounded-full h-2">
                          <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" :style="`width: ${completionRatePercentage}%`"></div>
                        </div>
                      </div>
                      
                      <div class="bg-white/60 rounded-xl p-4">
                        <div class="flex justify-between items-center mb-2">
                          <span class="text-slate-600 font-medium">Customer Satisfaction</span>
                          <span class="font-bold text-purple-600">{{customerSatisfaction}}%/5.0</span>
                        </div>
                        <div class="w-full bg-slate-200 rounded-full h-2">
                          <div class="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" :style="`width: ${(customerSatisfaction/5)*100}%`"></div>
                        </div>
                      </div>
                      
                      <div class="bg-white/60 rounded-xl p-4">
                        <div class="flex justify-between items-center mb-2">
                          <span class="text-slate-600 font-medium">Repeat Customers</span>
                          <span class="font-bold text-amber-600">{{repeatCustomerRate}}%</span>
                        </div>
                        <div class="w-full bg-slate-200 rounded-full h-2">
                          <div class="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full" :style="`width: ${repeatCustomerRate}%`"></div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Achievement Badges -->
                    <div class="space-y-4">
                      <h4 class="font-semibold text-slate-700 mb-4">Achievements</h4>
                      <div class="grid grid-cols-2 gap-4">
                        <div class="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 text-center border border-yellow-200">
                          <div class="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 mx-auto mb-2 flex items-center justify-center">
                            <Star class="h-5 w-5 text-white fill-current" />
                          </div>
                          <div class="text-xs font-semibold text-amber-800">Top Rated</div>
                        </div>
                        
                        <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center border border-green-200">
                          <div class="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 mx-auto mb-2 flex items-center justify-center">
                            <Shield class="h-5 w-5 text-white" />
                          </div>
                          <div class="text-xs font-semibold text-green-800">Verified User</div>
                        </div>
                        
                        <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 text-center border border-blue-200">
                          <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 mx-auto mb-2 flex items-center justify-center">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                          </div>
                          <div class="text-xs font-semibold text-blue-800">Fast Responder</div>
                        </div>
                        
                        <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center border border-purple-200">
                          <div class="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 mx-auto mb-2 flex items-center justify-center">
                            <Heart class="h-5 w-5 text-white fill-current" />
                          </div>
                          <div class="text-xs font-semibold text-purple-800">Community Favorite</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Star,
  MapPin,
  Shield,
  Edit,
  MessageCircle,
  Heart,
  Eye
} from 'lucide-vue-next'
import Button from '@/components/ui/button.vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.vue'
import { Separator } from '@/components/ui/Separator.vue'
import ItemCard from '@/components/ui/ItemCard.vue'
import ReviewCard from '@/components/ReviewCard.vue'
import { useUserProfile } from '@/composables/useUserProfile'
import { useListings } from '@/composables/useListings'
import { useReviews } from '@/composables/useReviews'
import { useUserStats } from '@/composables/useUserStats'//HIIIII

const route = useRoute()
const router = useRouter()

// Use the Firebase user profile composable
const { user, loading, error, isOwnProfile, getUserProfileById, currentUser, loadUserProfile, authInitialized } = useUserProfile()

// Use the listings composable
const { getUserListings, loading: listingsLoading } = useListings()

// Use the reviews composable
const { getUserReviews, getUserAverageRating, loading: reviewsComposableLoading } = useReviews()

// State
const activeTab = ref('overview')
const isFollowing = ref(false)
const userItems = ref([])
const reviews = ref([])
const itemsLoading = ref(false)
const reviewsLoading = ref(false)

// If viewing someone else's profile, get their ID from route params
const profileUserId = computed(() => route.params.id || null)

// Mock data for items and reviews (you can replace with Firebase data later)
const mockUserItems = [
  {
    id: "1",
    title: "Calculus Textbook - 8th Edition",
    description: "Stewart Calculus textbook in excellent condition.",
    price: 15,
    period: "week",
    category: "Textbooks",
    condition: "Excellent",
    owner: "User",
    rating: 4.9,
    location: "Campus North",
    image: "/calculus-textbook-front-cover.jpg",
    available: true,
    postedAt: "2 days ago",
    views: 24,
    favorites: 5,
  },
  {
    id: "7",
    title: "Engineering Mechanics Textbook",
    description: "Hibbeler Engineering Mechanics - Statics & Dynamics",
    price: 20,
    period: "week",
    category: "Textbooks",
    condition: "Good",
    owner: "User",
    rating: 4.9,
    location: "Campus North",
    image: "/placeholder.svg?key=eng-mech",
    available: true,
    postedAt: "1 week ago",
    views: 18,
    favorites: 3,
  },
]
const handleImageError = (event) => {
  console.error('Image failed to load:', event.target.src)
  event.target.style.display = 'none'
}
const mockReviews = [
  {
    id: "1",
    reviewer: {
      name: "Mike Johnson",
      avatar: "/placeholder.svg?key=mike",
      rating: 5,
    },
    rating: 5,
    comment:
      "Great experience! The item was exactly as described and the owner was very responsive.",
    item: "Calculus Textbook - 8th Edition",
    date: "1 week ago",
  },
  {
    id: "2",
    reviewer: {
      name: "Emma Davis",
      avatar: "/placeholder.svg?key=emma",
      rating: 5,
    },
    rating: 5,
    comment: "Excellent communication and the item was in perfect condition. Highly recommend!",
    item: "Engineering Mechanics Textbook",
    date: "2 weeks ago",
  },
  {
    id: "3",
    reviewer: {
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg?key=alex",
      rating: 4,
    },
    rating: 4,
    comment:
      "Good experience overall. The book was helpful for my studies. Minor wear but nothing major.",
    item: "Calculus Textbook - 8th Edition",
    date: "3 weeks ago",
  },
]

// Mock user profile for testing
const mockUserProfile = {
  id: "test-user-1",
  name: "tester1",
  email: "test@u.nus.edu",
  avatar: "",
  bio: "Software engineering student passionate about technology and innovation.",
  location: "testing location",
  skills: "JavaScript, Vue.js, Photography",
  interests: "Programming, Design, Music",
  shortBio: "Love building things and solving problems!",
  linkedin: "",
  instagram: "",
  telegram: "",
  verified: false,
  rating: 0,
  reviewCount: 0,
  totalRentals: 0,
  responseTime: "< 3 hours",
  joinedDate: "October 2025",
  stats: {
    itemsListed: 2,
    itemsRented: 5,
    totalEarnings: 150,
    successfulTransactions: 8,
  }
}

// Methods
const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

const sendMessage = () => {
  router.push('/messages')
}

const toggleFollow = () => {
  isFollowing.value = !isFollowing.value
  // TODO: Implement follow/unfollow in Firebase
}

const debugCreateProfile = async () => {
  if (currentUser.value) {
    console.log('Manually triggering profile creation for:', currentUser.value.uid)
    await loadUserProfile(currentUser.value.uid)
  } else {
    console.log('No current user found')
  }
}

// Load user's listings from Firebase
const loadUserItems = async (userId = null) => {
  try {
    itemsLoading.value = true
    console.log('Loading user items for:', userId || currentUser.value?.uid)
    
    const listings = await getUserListings(userId)
    userItems.value = listings
    
    console.log(`Loaded ${listings.length} items for user`)
  } catch (err) {
    console.error('Error loading user items:', err)
    userItems.value = []
  } finally {
    itemsLoading.value = false
  }
}

// Load user's reviews from Firebase
const loadUserReviews = async (userId = null) => {
  try {
    reviewsLoading.value = true
    console.log('Loading user reviews for:', userId || currentUser.value?.uid)
    
    const userReviews = await getUserReviews(userId)
    reviews.value = userReviews
    
    console.log(`Loaded ${userReviews.length} reviews for user`)
    
    // Also update user rating based on reviews
    if (userReviews.length > 0) {
      const { average, total } = await getUserAverageRating(userId)
      if (user.value) {
        user.value.rating = average
        user.value.reviewCount = total
      }
    }
  } catch (err) {
    console.error('Error loading user reviews:', err)
    reviews.value = []
  } finally {
    reviewsLoading.value = false
  }
}
const unwatch = watch(() => route.fullPath, async (newPath) => {
  if (newPath === '/profile') {
    console.log('Profile route activated, reloading data...')
    if (profileUserId.value) {
      await getUserProfileById(profileUserId.value)
    } else {
      await loadUserProfile()
    }
  }
})
const { calcStats, loading: statsLoading } = useUserStats()//HIIIIIIIIII
const userStats = ref(null)
const loadUserStats = async (userId = null) => {
  try {
    const targetUserId = userId || currentUser.value?.uid
    if (!targetUserId) return
    
    console.log('Calculating stats for user:', targetUserId)
    const stats = await calcStats(targetUserId)
    userStats.value = stats
    
    // Update user object with calculated stats
    if (user.value) {
      user.value.stats = {
        itemsListed: stats.itemsListed,
        itemsRented: stats.itemsRented,
        totalEarnings: stats.totalEarnings,
        successfulTransactions: stats.successfulTransactions
      }
      user.value.rating = stats.averageRating
      user.value.reviewCount = stats.totalReviews
    }
    
    console.log('Calculated stats:', stats)
  } catch (err) {
    console.error('Error loading user stats:', err)
  }
}
const responseRatePercentage = computed(() => userStats.value?.responseRate || 98)//HIIIIIIIIIII
const completionRatePercentage = computed(() => userStats.value?.completionRate || 100)
const customerSatisfaction = computed(() => user.value?.rating || 0)
const repeatCustomerRate = computed(() => userStats.value?.repeatCustomerRate || 0)//HIIIIIIIIIIII

onBeforeUnmount(() => {
  unwatch()
})
// Debug function for tabs
const debugTabChange = (tabValue) => {
  console.log('Tab changed to:', tabValue)
  activeTab.value = tabValue
}

// Load profile data
onMounted(async () => {
  console.log('ProfilePage mounted')
  console.log('Route params:', route.params)
  console.log('Profile user ID:', profileUserId.value)
  
  try {
    // Wait for authentication to initialize
    if (!authInitialized.value) {
      console.log('Waiting for authentication to initialize...')
      await new Promise((resolve) => {
        const checkAuth = () => {
          if (authInitialized.value) {
            resolve()
          } else {
            setTimeout(checkAuth, 100)
          }
        }
        checkAuth()
      })
    }

    // Check if user is authenticated
    if (!currentUser.value) {
      console.log('User not authenticated, redirecting to auth...')
      router.push('/auth')
      return
    }

    // If there's a profile ID in the route, load that user's profile
    if (profileUserId.value) {
      console.log('Loading specific user profile:', profileUserId.value)
      await getUserProfileById(profileUserId.value)
      // Load listings for the specific user
      await loadUserItems(profileUserId.value)
      // Load reviews for the specific user
      await loadUserReviews(profileUserId.value)
    } else {
      // Load listings for the current user
      await loadUserItems()
      // Load reviews for the current user
      await loadUserReviews()
    }
    
    // Use mock profile for testing if no user data is available
    if (!user.value) {
      user.value = mockUserProfile
    }
    if (profileUserId.value) {
      await loadUserStats(profileUserId.value)
    } else {
      await loadUserStats()
    }//HIIIIIIIII
    console.log('Final user value:', user.value)
    console.log('Active tab:', activeTab.value)
    console.log('User items:', userItems.value.length)
    console.log('Reviews:', reviews.value.length)
  } catch (error) {
    console.error('Error loading profile:', error)
  }
})
</script>

<style scoped>
/* Add any custom styles here */
</style>