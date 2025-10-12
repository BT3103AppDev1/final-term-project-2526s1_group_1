<template>
  <Card>
    <CardContent class="p-4">
      <div class="flex items-start gap-4">
        <Avatar>
          <AvatarImage :src="review.reviewer.avatar" />
          <AvatarFallback>
            {{ getInitials(review.reviewer.name) }}
          </AvatarFallback>
        </Avatar>
        <div class="flex-1">
          <div class="flex items-center justify-between mb-2">
            <div>
              <h4 class="font-semibold">{{ review.reviewer.name }}</h4>
              <p class="text-xs text-muted-foreground">{{ review.date }}</p>
            </div>
            <div class="flex items-center gap-1">
              <Star
                v-for="i in 5"
                :key="i"
                :class="[
                  'h-4 w-4',
                  i <= review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                ]"
              />
            </div>
          </div>
          <p class="text-sm text-foreground mb-2">{{ review.comment }}</p>
          <Badge variant="secondary" class="text-xs">
            {{ review.item }}
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { Star } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Badge from '@/components/ui/badge.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar.vue'

const props = defineProps({
  review: {
    type: Object,
    required: true
  }
})

const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
}
</script>