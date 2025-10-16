<template>
  <div class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
    <slot />
  </div>
</template>

<script>
import { defineComponent, h, ref } from 'vue'

// Avatar component
export const Avatar = defineComponent({
  name: 'Avatar',
  props: {
    class: String
  },
  setup(props, { slots }) {
    return () =>
      h('div', {
        class: [
          'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
          props.class
        ].filter(Boolean).join(' ')
      }, slots.default ? slots.default() : [])
  }
})

// AvatarImage component  
export const AvatarImage = defineComponent({
  name: 'AvatarImage',
  props: {
    src: String,
    alt: String,
    class: String
  },
  emits: ['error'],
  setup(props, { emit }) {
    const hasError = ref(false)
    
    const handleError = () => {
      hasError.value = true
      emit('error')
    }
    
    return () => {
      if (hasError.value || !props.src) return null
      
      return h('img', {
        src: props.src,
        alt: props.alt,
        class: ['aspect-square h-full w-full', props.class].filter(Boolean).join(' '),
        onError: handleError
      })
    }
  }
})

// AvatarFallback component
export const AvatarFallback = defineComponent({
  name: 'AvatarFallback',
  props: {
    class: String
  },
  setup(props, { slots }) {
    return () =>
      h('div', {
        class: [
          'flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium',
          props.class
        ].filter(Boolean).join(' ')
      }, slots.default ? slots.default() : [])
  }
})

// Default export for easier importing
export default {
  Avatar,
  AvatarImage,
  AvatarFallback
}
</script>
