<template>
  <label
    :for="htmlFor"
    :class="cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      props.class
    )"
    v-bind="$attrs"
  >
    <slot />
  </label>
</template>

<script setup>
const props = defineProps({
  htmlFor: {
    type: String,
    default: undefined
  },
  class: {
    type: String,
    default: ''
  }
})

// Simple class name utility function
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}
</script>

<script>
export default {
  name: 'Label',
  inheritAttrs: false
}
</script>
