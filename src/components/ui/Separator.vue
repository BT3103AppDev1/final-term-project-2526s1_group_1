<template>
  <div
    data-slot="separator"
    :aria-orientation="orientation"
    role="separator"
    :aria-hidden="decorative"
    :class="[
      'bg-border shrink-0',
      orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
      className
    ]"
  ></div>
</template>

<script setup>
defineProps({
  className: { type: String, default: '' },
  orientation: {
    type: String,
    default: 'horizontal',
    validator: v => ['horizontal', 'vertical'].includes(v)
  },
  decorative: { type: Boolean, default: true }
})
</script>

<style scoped></style>
