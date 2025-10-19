<template>
  <div class="relative inline-block w-full">
    <!-- Trigger -->
    <button
      ref="triggerRef"
      type="button"
      class="flex w-full items-center justify-between rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      :class="{ 'border-blue-500 ring-2 ring-blue-200': open }"
      @click="toggleDropdown"
    >
      <span :class="{ 'text-slate-400': !selectedLabel }">{{ selectedLabel || placeholder }}</span>
      <ChevronDown
        class="h-5 w-5 text-slate-500 transition-transform duration-200"
        :class="{ 'rotate-180 text-blue-500': open }"
      />
    </button>

    <!-- Dropdown (Teleported to body to fix z-index/overflow issues) -->
    <Teleport to="body">
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
          class="fixed z-[999999] max-h-60 w-[var(--dropdown-width)] overflow-auto rounded-lg border-2 border-slate-300 bg-white shadow-2xl focus:outline-none"
          :style="dropdownStyle"
        >
          <li
            v-for="option in options"
            :key="option.value || option"
            class="cursor-pointer select-none px-4 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-150 border-b border-slate-100 last:border-b-0"
            :class="{ 'bg-blue-100 text-blue-800 font-semibold': modelValue === (option.value || option) }"
            @click="selectOption(option)"
          >
            {{ option.label || option }}
          </li>
        </ul>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'

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

const dropdownStyle = ref({
  top: '0px',
  left: '0px',
  '--dropdown-width': '100%',
})
const selectedLabel = computed(() => {
  const found = props.options.find(opt => (opt.value || opt) === props.modelValue)
  return found ? found.label || found : ''
})

function updateDropdownPosition() {
  if (!triggerRef.value) return
  nextTick(() => {
    const rect = triggerRef.value.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const spaceBelow = viewportHeight - rect.bottom
    const spaceAbove = rect.top

    const dropdownHeight = 240 // ~max-h-60
    const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow

    dropdownStyle.value = {
      position: 'fixed',
      left: `${rect.left}px`,
      top: openUpward ? `${rect.top - Math.min(dropdownHeight, spaceAbove)}px` : `${rect.bottom + 4}px`,
      '--dropdown-width': `${rect.width}px`,
    }
  })
}

function toggleDropdown() {
  open.value = !open.value
  if (open.value) updateDropdownPosition()
}

function closeDropdown() {
  open.value = false
}

function selectOption(option) {
  emit('update:modelValue', option.value || option)
  closeDropdown()
}

// Close dropdown when clicking outside both button and dropdown
onClickOutside(triggerRef, closeDropdown)
onClickOutside(dropdownRef, closeDropdown)

// Close with Escape key
function handleEscape(e) {
  if (e.key === 'Escape') closeDropdown()
}

// Recalculate on scroll/resize
function handleReposition() {
  if (open.value) updateDropdownPosition()
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
  window.addEventListener('scroll', handleReposition, true)
  window.addEventListener('resize', handleReposition)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
  window.removeEventListener('scroll', handleReposition, true)
  window.removeEventListener('resize', handleReposition)
})
</script>

<style scoped>
ul::-webkit-scrollbar {
  width: 6px;
}
ul::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.3);
  border-radius: 10px;
}
</style>
