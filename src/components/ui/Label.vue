<template>
  <label
    data-slot="label"
    :class="computedClass"
    v-bind="$attrs"
  >
    <slot />
  </label>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  className: {
    type: String,
    default: ''
  }
})

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Computed class merging
const computedClass = computed(() =>
  cn(
    'flex items-center gap-2 text-sm leading-none font-medium select-none',
    'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
    props.className
  )
)
</script>

<style scoped>
</style>
