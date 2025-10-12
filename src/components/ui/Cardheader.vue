<template>
  <div
    data-slot="card-header"
    class="grid items-start gap-2 px-6 border-b pb-4"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  className: {
    type: String,
    default: ''
  }
})
</script>
