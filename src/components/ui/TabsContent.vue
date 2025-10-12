<template>
  <div
    v-if="isActive"
    data-slot="tabs-content"
    :class="['flex-1 outline-none', className]"
  >
    <slot />
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'

const props = defineProps({
  value: { type: String, required: true },
  className: { type: String, default: '' }
})
const tabs = inject('tabsContext')
const isActive = computed(() => tabs?.activeTab.value === props.value)
</script>
