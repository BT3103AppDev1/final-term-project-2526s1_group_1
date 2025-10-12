<template>
  <div
    data-slot="tabs-list"
    :class="'bg-muted text-muted-foreground inline-flex h-9 w-full items-center justify-center rounded-lg p-[3px] gap-1 ' + className"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  className: { type: String, default: '' }
})
</script>
