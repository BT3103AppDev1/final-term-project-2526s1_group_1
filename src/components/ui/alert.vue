<template>
  <div
    class="rounded-md border p-4 flex items-start gap-3"
    :class="variantClasses"
  >
    <component
      v-if="icon"
      :is="icon"
      class="h-5 w-5 mt-0.5 shrink-0"
    />
    <div class="flex-1">
      <p class="font-medium">{{ title }}</p>
      <p class="text-sm text-muted-foreground">
        <slot />
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  icon: Object,
  variant: {
    type: String,
    default: 'default',
  },
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'destructive':
      return 'border-destructive/50 text-destructive bg-destructive/10'
    case 'success':
      return 'border-green-600/50 text-green-700 bg-green-100 dark:bg-green-900/20'
    case 'warning':
      return 'border-yellow-600/50 text-yellow-700 bg-yellow-100 dark:bg-yellow-900/20'
    default:
      return 'border-border text-foreground bg-card'
  }
})
</script>
