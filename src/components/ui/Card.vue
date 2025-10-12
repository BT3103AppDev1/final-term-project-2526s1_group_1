<template>
  <div
    data-slot="card"
    class="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm"
  >
    <slot />
  </div>
</template>

<script setup>
// no exports here — this file defines only the main <Card> wrapper
</script>
