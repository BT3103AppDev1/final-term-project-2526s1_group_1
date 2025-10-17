<template>
  <div class="bg-white rounded-xl shadow-lg p-6 border-0">
    <h3 class="text-lg font-semibold text-slate-900 mb-4">Leave a Review</h3>
    
    <form @submit.prevent="submitReview" class="space-y-4">
      <!-- Rating -->
      <div>
        <Label class="text-sm font-medium text-slate-700 mb-2">Rating</Label>
        <div class="flex items-center gap-2">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            @click="rating = star"
            class="transition-colors"
          >
            <Star
              :class="star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'"
              class="h-6 w-6 hover:text-yellow-400"
            />
          </button>
          <span class="ml-2 text-sm text-slate-600">{{ rating }}/5</span>
        </div>
      </div>

      <!-- Comment -->
      <div>
        <Label for="comment" class="text-sm font-medium text-slate-700 mb-2">Your Review</Label>
        <Textarea
          id="comment"
          v-model="comment"
          placeholder="Share your experience with this rental..."
          class="min-h-[100px] resize-none"
          required
        />
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          @click="$emit('cancel')"
          :disabled="loading"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          :disabled="loading || !rating || !comment.trim()"
          class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <span v-if="loading">Submitting...</span>
          <span v-else>Submit Review</span>
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Star } from 'lucide-vue-next'
import { Button } from '@/components/ui/button.vue'
import { Label } from '@/components/ui/Label.vue'
import { Textarea } from '@/components/ui/TextArea.vue'
import { useReviews } from '@/composables/useReviews'

const props = defineProps({
  rentalData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['success', 'cancel'])

const { createReview, loading } = useReviews()

const rating = ref(5)
const comment = ref('')

const submitReview = async () => {
  try {
    const reviewData = {
      ownerId: props.rentalData.ownerId,
      ownerName: props.rentalData.ownerName,
      listingId: props.rentalData.listingId,
      listingTitle: props.rentalData.listingTitle,
      rentalId: props.rentalData.rentalId,
      rating: rating.value,
      comment: comment.value.trim()
    }

    await createReview(reviewData)
    
    emit('success', {
      rating: rating.value,
      comment: comment.value.trim()
    })
    
    // Reset form
    rating.value = 5
    comment.value = ''
  } catch (error) {
    console.error('Error submitting review:', error)
    // You could add a toast notification here
  }
}
</script>
