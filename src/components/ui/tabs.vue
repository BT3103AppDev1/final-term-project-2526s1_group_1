<template>
  <div class="tabs-container" :class="$attrs.class">
    <slot />
  </div>
</template>

<script setup>
import { provide, ref } from 'vue'

const activeTab = defineModel('modelValue', { default: 'overview' })

provide('activeTab', activeTab)
</script>

<script>
import { defineComponent, h, inject } from 'vue'

export const Tabs = defineComponent({
  name: 'Tabs',
  props: {
    modelValue: { type: String, default: 'overview' },
    class: String
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    provide('activeTab', {
      value: props.modelValue,
      setValue: (value) => emit('update:modelValue', value)
    })
    
    return () =>
      h('div', { class: props.class }, slots.default ? slots.default() : [])
  }
})

export const TabsList = defineComponent({
  name: 'TabsList',
  props: { class: String },
  setup(props, { slots }) {
    return () =>
      h('div', { 
        class: [
          'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
          props.class
        ].filter(Boolean).join(' ')
      }, slots.default ? slots.default() : [])
  }
})

export const TabsTrigger = defineComponent({
  name: 'TabsTrigger',
  props: { 
    value: { type: String, required: true },
    class: String 
  },
  setup(props, { slots }) {
    const activeTab = inject('activeTab')
    
    const isActive = () => activeTab?.value === props.value
    
    const handleClick = () => {
      activeTab?.setValue(props.value)
    }
    
    return () =>
      h('button', {
        class: [
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          isActive() ? 'bg-background text-foreground shadow-sm' : '',
          props.class
        ].filter(Boolean).join(' '),
        onClick: handleClick
      }, slots.default ? slots.default() : [])
  }
})

export const TabsContent = defineComponent({
  name: 'TabsContent',
  props: { 
    value: { type: String, required: true },
    class: String 
  },
  setup(props, { slots }) {
    const activeTab = inject('activeTab')
    
    const isActive = () => activeTab?.value === props.value
    
    return () => {
      if (!isActive()) return null
      
      return h('div', {
        class: [
          'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          props.class
        ].filter(Boolean).join(' ')
      }, slots.default ? slots.default() : [])
    }
  }
})
</script>
