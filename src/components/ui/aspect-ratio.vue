<template>
  <div class="relative w-full" :style="{ aspectRatio: ratio }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  ratio: {
    type: String,
    default: '16/9',
  },
})
</script>
