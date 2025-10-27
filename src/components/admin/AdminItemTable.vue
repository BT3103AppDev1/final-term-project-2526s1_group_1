<template>
  <div class="admin-table">
    <h3>Items Management</h3>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Owner</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.status }}</td>
            <td>
              <button class="action-btn edit">Edit</button>
              <button class="action-btn delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  { id: 1, name: 'Laptop', owner: 'John Doe', category: 'Electronics', status: 'Available' },
  { id: 2, name: 'Textbook', owner: 'Jane Smith', category: 'Books', status: 'Rented' }
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
.edit {
  background-color: #f59e0b;
  color: white;
}
.delete {
  background-color: #ef4444;
  color: white;
}
</style>
