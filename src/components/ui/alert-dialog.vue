<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
        @click.self="close"
      >
        <div
          class="bg-card rounded-lg shadow-lg w-full max-w-md p-6 z-50 relative"
        >
          <header class="mb-4">
            <h3 class="text-lg font-semibold">{{ title }}</h3>
            <p v-if="description" class="text-sm text-muted-foreground">
              {{ description }}
            </p>
          </header>
          <div class="mb-4">
            <slot />
          </div>
          <footer class="flex justify-end gap-2">
            <button
              class="btn-outline px-4 py-2 rounded-md"
              @click="close"
            >
              Cancel
            </button>
            <button
              class="btn-primary px-4 py-2 rounded-md"
              @click="$emit('confirm')"
            >
              Confirm
            </button>
          </footer>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
  title: String,
  description: String,
})

const emit = defineEmits(['update:open', 'confirm'])

function close() {
  emit('update:open', false)
}
</script>
