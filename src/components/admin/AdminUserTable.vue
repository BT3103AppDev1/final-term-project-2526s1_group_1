<template>
  <div class="admin-table">
    <h3>Users Management</h3>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>University</th>
            <th>Course</th>
            <th>Join Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.university }}</td>
            <td>{{ user.course }}</td>
            <td>{{ user.joinDate }}</td>
            <td>{{ user.status }}</td>
            <td>
              <button class="action-btn view">View</button>
              <button class="action-btn edit">Edit</button>
              <button class="action-btn suspend">Suspend</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const users = ref([
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@university.edu', 
    university: 'NUS', 
    course: 'Computer Science', 
    joinDate: '2024-01-01',
    status: 'Active' 
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane@university.edu', 
    university: 'NTU', 
    course: 'Business', 
    joinDate: '2024-01-05',
    status: 'Active' 
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

.suspend {
  background-color: #ef4444;
  color: white;
}
</style>
