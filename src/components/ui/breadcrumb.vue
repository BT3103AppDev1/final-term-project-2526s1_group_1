<template>
  <nav aria-label="Breadcrumb" class="text-sm text-muted-foreground">
    <ol class="flex items-center space-x-2">
      <li v-for="(crumb, i) in crumbs" :key="i" class="flex items-center">
        <router-link
          v-if="crumb.to && i < crumbs.length - 1"
          :to="crumb.to"
          class="hover:text-foreground"
        >
          {{ crumb.label }}
        </router-link>
        <span v-else class="text-foreground font-medium">{{ crumb.label }}</span>
        <span v-if="i < crumbs.length - 1" class="mx-2 text-border">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineProps({
  crumbs: {
    type: Array,
    default: () => [],
  },
})
</script>
