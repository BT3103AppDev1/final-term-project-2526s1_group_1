<template>
  <div
    data-slot="avatar"
    class="relative inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground overflow-hidden"
    :class="sizeClass"
  >
    <!-- Avatar Image -->
    <img
      v-if="src && !hasError"
      :src="src"
      :alt="alt"
      class="object-cover w-full h-full rounded-full"
      @error="onError"
    />

    <!-- Fallback (initials or slot content) -->
    <span v-else class="font-semibold select-none">
      <slot>{{ initials }}</slot>
    </span>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  src: String,
  alt: String,
  name: String,
  size: {
    type: String,
    default: 'md',
  },
})

const hasError = ref(false)
function onError() {
  hasError.value = true
}

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-8 h-8 text-xs'
    case 'lg': return 'w-16 h-16 text-lg'
    default: return 'w-10 h-10 text-sm'
  }
})

const initials = computed(() =>
  props.name
    ? props.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?'
)
</script>

<style scoped>
/* Optional: smooth transition when avatar loads */
img {
  transition: opacity 0.2s ease-in-out;
}
</style>
