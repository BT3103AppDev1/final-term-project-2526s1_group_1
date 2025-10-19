<template>
  <div class="admin-table">
    <h3>Transactions Management</h3>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Item</th>
            <th>Renter</th>
            <th>Owner</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td>{{ transaction.id }}</td>
            <td>{{ transaction.item }}</td>
            <td>{{ transaction.renter }}</td>
            <td>{{ transaction.owner }}</td>
            <td>{{ transaction.startDate }}</td>
            <td>{{ transaction.endDate }}</td>
            <td>{{ transaction.status }}</td>
            <td>
              <button class="action-btn view">View</button>
              <button class="action-btn edit">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const transactions = ref([
  { 
    id: 1, 
    item: 'Laptop', 
    renter: 'Alice Johnson', 
    owner: 'John Doe', 
    startDate: '2024-01-15', 
    endDate: '2024-01-22', 
    status: 'Active' 
  },
  { 
    id: 2, 
    item: 'Textbook', 
    renter: 'Bob Wilson', 
    owner: 'Jane Smith', 
    startDate: '2024-01-10', 
    endDate: '2024-01-20', 
    status: 'Completed' 
  }
])
</script>

<style scoped>
.admin-table {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.action-btn {
  padding: 0.25rem 0.5rem;
  margin: 0 0.25rem;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
}

.view {
  background-color: #3b82f6;
  color: white;
}

.edit {
  background-color: #f59e0b;
  color: white;
}
</style>
