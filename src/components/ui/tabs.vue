<template>
  <div :class="['flex flex-col gap-2', className]">
    <slot />
  </div>
</template>

<script setup>
import { ref, provide, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  className: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const activeTab = ref(props.modelValue)
watch(() => props.modelValue, v => (activeTab.value = v))

function setActiveTab(value) {
  activeTab.value = value
  emit('update:modelValue', value)
}

provide('tabsContext', { activeTab, setActiveTab })
</script>
