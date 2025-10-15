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

<script>
import { defineComponent, h } from 'vue'

export const Separator = defineComponent({
  name: 'Separator',
  props: {
    class: String,
    orientation: {
      type: String,
      default: 'horizontal',
      validator: v => ['horizontal', 'vertical'].includes(v)
    },
    decorative: { type: Boolean, default: true }
  },
  setup(props) {
    return () =>
      h('div', {
        'data-slot': 'separator',
        'aria-orientation': props.orientation,
        'role': 'separator',
        'aria-hidden': props.decorative,
        class: [
          'bg-border shrink-0',
          props.orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
          props.class
        ].filter(Boolean).join(' ')
      })
  }
})
</script>

<style scoped></style>
