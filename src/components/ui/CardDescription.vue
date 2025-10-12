<template>
  <div
    data-slot="card-description"
    class="text-muted-foreground text-sm"
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
