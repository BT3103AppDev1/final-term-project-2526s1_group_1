<template>
  <div class="border rounded-md divide-y divide-border">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="border-b last:border-none"
    >
      <button
        class="w-full flex justify-between items-center text-left py-3 px-4 font-medium text-sm hover:underline focus:outline-none"
        @click="toggle(index)"
      >
        <span>{{ item.title }}</span>
        <ChevronDown
          class="h-4 w-4 text-muted-foreground transition-transform duration-200"
          :class="{ 'rotate-180': openIndex === index }"
        />
      </button>

      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-96"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 max-h-96"
        leave-to-class="opacity-0 max-h-0"
      >
        <div
          v-show="openIndex === index"
          class="px-4 pb-4 text-sm text-muted-foreground"
        >
          <slot :name="`content-${index}`">{{ item.content }}</slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const openIndex = ref(null)

function toggle(index) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>
