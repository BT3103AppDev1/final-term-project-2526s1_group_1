<template>
  <div class="relative inline-block w-full">
    <!-- Trigger -->
    <button
      ref="triggerRef"
      type="button"
      class="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-ring"
      @click="toggleDropdown"
    >
      <span>{{ selectedLabel || placeholder }}</span>
      <ChevronDown
        class="h-4 w-4 text-muted-foreground transition-transform"
        :class="{ 'rotate-180': open }"
      />
    </button>

    <!-- Dropdown -->
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <ul
        v-if="open"
        ref="dropdownRef"
        class="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-md border border-border bg-card shadow-md focus:outline-none"
      >
        <li
          v-for="option in options"
          :key="option.value || option"
          class="cursor-pointer select-none px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition"
          :class="{ 'bg-accent text-accent-foreground': modelValue === (option.value || option) }"
          @click="selectOption(option)"
        >
          {{ option.label || option }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core' // npm install @vueuse/core

const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Select an option',
  },
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const triggerRef = ref(null)
const dropdownRef = ref(null)

const selectedLabel = computed(() => {
  const found = props.options.find(opt => (opt.value || opt) === props.modelValue)
  return found ? found.label || found : ''
})

function toggleDropdown() {
  open.value = !open.value
}

function selectOption(option) {
  emit('update:modelValue', option.value || option)
  open.value = false
}

// Close dropdown when clicking outside
onClickOutside(triggerRef, () => (open.value = false))
onClickOutside(dropdownRef, () => (open.value = false))

// Close dropdown with Escape key
function handleEscape(e) {
  if (e.key === 'Escape') open.value = false
}
onMounted(() => window.addEventListener('keydown', handleEscape))
onBeforeUnmount(() => window.removeEventListener('keydown', handleEscape))
</script>

<style scoped>
/* Smooth dropdown */
ul::-webkit-scrollbar {
  width: 6px;
}
ul::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.3);
  border-radius: 10px;
}
</style>
