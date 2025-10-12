<template>
  <div
    data-slot="card-content"
    class="px-6"
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
