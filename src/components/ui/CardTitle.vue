<template>
  <div
    data-slot="card-title"
    class="leading-none font-semibold text-lg"
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
