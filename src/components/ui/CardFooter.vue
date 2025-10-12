<template>
  <div
    data-slot="card-footer"
    class="flex items-center px-6 border-t pt-4"
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
