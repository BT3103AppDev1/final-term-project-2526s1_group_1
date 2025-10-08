<template>
  <div
    class="group hover:shadow-lg transition-all duration-200 overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
  >
    <div class="relative">
      <img
        :src="item.image"
        :alt="item.title"
        class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
      />
      <button
        class="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 backdrop-blur-sm inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground"
      >
        <Heart class="h-4 w-4" />
      </button>

      <div
        v-if="!item.available"
        class="absolute inset-0 bg-black/50 flex items-center justify-center"
      >
        <span
          class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-background text-foreground"
        >
          Currently Rented
        </span>
      </div>
    </div>

    <div class="p-6 pb-2">
      <div class="flex items-start justify-between gap-2">
        <h3
          class="text-lg font-semibold leading-none tracking-tight line-clamp-2 group-hover:text-primary transition-colors"
        >
          <!-- ✅ Replaced NuxtLink with router-link -->
          <router-link :to="`/item/${item.id}`">
            {{ item.title }}
          </router-link>
        </h3>

        <span
          class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 shrink-0"
        >
          {{ item.category }}
        </span>
      </div>

      <p class="text-sm text-muted-foreground line-clamp-2 mt-2">
        {{ item.description }}
      </p>
    </div>

    <div class="p-6 pt-0">
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div class="text-2xl font-bold text-primary">
            ${{ item.price }}
            <span class="text-sm font-normal text-muted-foreground"
              >/{{ item.period }}</span
            >
          </div>

          <span
            :class="[
              'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
              item.condition === 'Excellent'
                ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80'
                : 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80'
            ]"
          >
            {{ item.condition }}
          </span>
        </div>

        <div class="flex items-center gap-4 text-sm text-muted-foreground">
          <div class="flex items-center gap-1">
            <Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{{ item.rating }}</span>
          </div>
          <div class="flex items-center gap-1">
            <MapPin class="h-4 w-4" />
            <span>{{ item.location }}</span>
          </div>
          <div class="flex items-center gap-1">
            <Clock class="h-4 w-4" />
            <span>{{ item.postedAt }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2">
          <span class="text-sm text-muted-foreground">by {{ item.owner }}</span>

          <router-link
            v-if="item.available"
            :to="`/item/${item.id}`"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
          >
            View Details
          </router-link>

          <span
            v-else
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 opacity-50 cursor-not-allowed"
          >
            Unavailable
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Heart, Star, MapPin, Clock } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
defineProps({
  item: Object,
})
</script>

<style scoped></style>
