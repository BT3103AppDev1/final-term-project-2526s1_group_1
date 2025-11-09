<template>
  <div class="admin-container">
    <Tabs v-model="activeTab" class="w-full">
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="users">
          <Users class="mr-2 h-4 w-4" />
          Users
        </TabsTrigger>
        <TabsTrigger value="listings">
          <Package class="mr-2 h-4 w-4" />
          Listings
        </TabsTrigger>
        <TabsTrigger value="transactions">
          <TrendingUp class="mr-2 h-4 w-4" />
          Transactions
        </TabsTrigger>
      </TabsList>

      <!-- Stats Overview -->
      <div class="grid gap-4 md:grid-cols-4 mt-6">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Total Users</CardTitle>
            <Users class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ mockStats.totalUsers }}</div>
            <p class="text-xs text-muted-foreground">
              <span class="text-green-500">+{{ mockStats.usersGrowth }}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Active Listings</CardTitle>
            <Package class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ mockStats.activeListings }}</div>
            <p class="text-xs text-muted-foreground">
              <span class="text-green-500">+{{ mockStats.listingsGrowth }}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Total Transactions</CardTitle>
            <TrendingUp class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ mockStats.totalTransactions }}</div>
            <p class="text-xs text-muted-foreground">
              <span class="text-green-500">+{{ mockStats.transactionsGrowth }}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">${{ mockStats.monthlyRevenue }}</div>
            <p class="text-xs text-muted-foreground">
              <span class="text-green-500">+{{ mockStats.revenueGrowth }}%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <!-- Search and Filter -->
      <div class="flex items-center gap-4 mt-6">
        <div class="relative flex-1">
          <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            v-model="searchQuery"
            placeholder="Search..." 
            class="pl-8"
          />
        </div>
        <CustomSelect 
          v-model="filterStatus"
          :options="[
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'pending', label: 'Pending' },
            { value: 'suspended', label: 'Suspended' }
          ]"
          placeholder="Filter by status"
          class="w-[180px]"
        />
        <Button variant="outline">
          <Filter class="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      <!-- Tab Contents -->
      <TabsContent value="users" class="mt-6">
        <AdminUserTable />
      </TabsContent>

      <TabsContent value="listings" class="mt-6">
        <AdminItemTable />
      </TabsContent>

      <TabsContent value="transactions" class="mt-6">
        <AdminTransactionTable />
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Users, 
  Package, 
  TrendingUp, 
  Search, 
  Filter 
} from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/Card.vue'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs.vue'
import CustomSelect from '@/components/ui/select.vue'
import Input from '@/components/ui/input.vue'
import Button from '@/components/ui/button.vue'
import AdminUserTable from '@/components/admin/AdminUserTable.vue'
import AdminItemTable from '@/components/admin/AdminItemTable.vue'
import AdminTransactionTable from '@/components/admin/AdminTransactionTable.vue'

// State
const activeTab = ref('users')
const searchQuery = ref('')
const filterStatus = ref('all')

// Mock stats data (replace with Firebase data later)
const mockStats = ref({
  totalUsers: 1247,
  usersGrowth: 12.5,
  activeListings: 342,
  listingsGrowth: 8.2,
  totalTransactions: 856,
  transactionsGrowth: 15.3,
  monthlyRevenue: 4234,
  revenueGrowth: 10.8
})
</script>

<style scoped>
.admin-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}
</style>