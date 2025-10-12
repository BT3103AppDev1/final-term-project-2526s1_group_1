<template>
  <button
    type="button"
    @click="selectTab"
    :class="[
      'text-sm font-medium rounded-md px-3 py-1 transition',
      isActive
        ? 'bg-background border border-border shadow-sm text-foreground'
        : 'text-muted-foreground hover:bg-muted',
      className
    ]"
  >
    <slot />
  </button>
</template>

<script setup>
import { inject, computed } from 'vue'

const props = defineProps({
  value: { type: String, required: true },
  className: { type: String, default: '' }
})

const tabs = inject('tabsContext') 
const isActive = computed(() => tabs?.activeTab.value === props.value)

function selectTab() {
  tabs?.setActiveTab(props.value)
}
</script>
