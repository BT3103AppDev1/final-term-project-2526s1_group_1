// Example usage of ReviewForm component
// This would typically be in a completed rental page or modal

<template>
  <div v-if="showReviewForm">
    <ReviewForm
      :rental-data="completedRental"
      @success="handleReviewSuccess"
      @cancel="showReviewForm = false"
    />
  </div>
</template>

<script setup>
import ReviewForm from '@/components/forms/ReviewForm.vue'

const showReviewForm = ref(false)

// Example rental data structure
const completedRental = {
  rentalId: 'rental123',
  ownerId: 'owner456',
  ownerName: 'John Doe',
  listingId: 'listing789',
  listingTitle: 'Calculus Textbook - 8th Edition'
}

const handleReviewSuccess = (reviewData) => {
  console.log('Review submitted successfully:', reviewData)
  showReviewForm.value = false
  // You could show a success message or refresh the page
  // You could also emit an event to parent component to refresh reviews
}
</script>
