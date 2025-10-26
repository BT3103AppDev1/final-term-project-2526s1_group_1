<template>
<div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <Card class="w-full max-w-md bg-white">
        <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
        <CardDescription>Share your experience with {{ownerName }}</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
        <!--Cust Satis-->
        <div>
            <Label class="text-lg font-semibold mb-3 block">Overall Experience</Label>
            <div class="flex gap-2 justify-center mb-2">
            <button v-for="i in 5" :key="i" @click="rating=i" class="focus:outline-none transition-transform hover:scale-110">
                <Star :class="['h-10 w-10 transition-colors',i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300']"/>
            </button>
            </div>
            <p class="text-center text-sm text-gray-600">{{rating}}/5 stars</p>
        </div>
        <!--Response Time-->
        <div>
        <Label class="text-lg font-semibold mb-3 block">Response Time</Label>
        <div class="space-y-2">
            <div class="flex gap-2 justify-center mb-2">
            <button v-for="i in 5" :key="i" @click="responseRating = i"class="focus:outline-none transition-transform hover:scale-110">
                <Star :class="['h-8 w-8 transition-colors',
                    i <= responseRating ? 'fill-blue-400 text-blue-400' : 'text-gray-300']"/>
            </button>
            </div>
            <div class="flex items-center gap-4">
            <span class="text-blue-600 font-bold text-sm min-w-[3rem]">{{ responseRating }}/5</span>
            <div class="flex justify-between text-xs text-gray-500 flex-1">
                <span>Very Slow</span>
                <span>Average</span>
                <span>Very Fast</span>
            </div>
            </div>
        </div>
        </div>
        <!--Item Cond-->
        <div>
        <Label class="text-lg font-semibold mb-3 block">Item Condition</Label>
        <div class="space-y-2">
            <div class="flex gap-2 justify-center mb-2">
            <button v-for="i in 5":key="i"@click="conditionRating = i"class="focus:outline-none transition-transform hover:scale-110">
                <Star :class="['h-8 w-8 transition-colors',
                    i <= conditionRating ? 'fill-green-400 text-green-400' : 'text-gray-300']"/>
            </button>
            </div>
            <div class="flex items-center gap-4">
            <span class="text-green-600 font-bold text-sm min-w-[3rem]">{{ conditionRating }}/5</span>
            <div class="flex justify-between text-xs text-gray-500 flex-1">
                <span>Poor</span>
                <span>As Described</span>
                <span>Excellent</span>
            </div>
            </div>
        </div>
        </div>
        <!-- Review Comment -->
        <div>
            <Label for="review" class="text-lg font-semibold mb-3 block">Your Review</Label>
            <Textarea id="review" v-model="comment" placeholder="Tell us about your experience with this lender..." rows="4"
            class="mt-2 resize-none"/>
        </div>
    </CardContent>
    <CardFooter class="flex gap-2">
        <Button variant="outline" @click="handleCancel" class="flex-1">Cancel</Button>
        <Button @click="handleSubmit" :disabled="!rating||!responseRating||!conditionRating||!comment.trim() ||submitting" class="flex-1 bg-blue-600 hover:bg-blue-700">
            {{ submitting?'Submitting...':'Submit Review' }}
        </Button>
    </CardFooter>
    </Card>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import {Star} from 'lucide-vue-next'
import { Card,CardContent,CardDescription,CardHeader,CardTitle,CardFooter } from '@/components/ui/Card.vue'
import Button from '@/components/ui/button.vue'
import Label from '@/components/ui/Label.vue'
import Textarea from '@/components/ui/TextArea.vue'
import {useReviews} from '@/composables/useReviews'
import {db} from '@/firebase/config'
import { doc,updateDoc,serverTimestamp,collection,query,where,getDocs} from 'firebase/firestore'

const props = defineProps({isOpen: Boolean,rentalId: String,ownerId: String,
    ownerName: String,listingId: String,listingTitle: String})
const emit = defineEmits(['close', 'success'])
const { createReview } = useReviews()
const rating = ref(0)
const responseRating = ref(0)
const conditionRating = ref(0)
const comment = ref('')
const submitting = ref(false)
const calculatePercentages = () => {//of star ratings
    const responseRate = Math.min(responseRating.value*20,100)
    const onTimeDelivery = Math.min(conditionRating.value*20,100)
    return { responseRate,onTimeDelivery }}

const checkExistingReview = async()=> {//check if review exists
    const reviewsQuery = query(
        collection(db, 'reviews'),
        where('rentalId','==',props.rentalId)
    )
    const reviewsSnap = await getDocs(reviewsQuery)
    return !reviewsSnap.empty
    return false
}
const handleCancel = () => {rating.value = 0, responseRating.value = 0, conditionRating.value = 0, comment.value = '', emit('close')}
const handleSubmit = async () => {
    if (!rating.value || !responseRating.value || !conditionRating.value || !comment.value.trim()) {
        alert('Please fill all fields')
        return}

const hasExistingReview = await checkExistingReview()
    if (hasExistingReview) {
        alert('Already reviewed')
        return
    }
    submitting.value = true
    const { responseRate, onTimeDelivery } = calculatePercentages()
    await createReview({
        ownerId: props.ownerId,
        ownerName: props.ownerName,
        listingId: props.listingId,
        listingTitle: props.listingTitle,
        rentalId: props.rentalId,
        rating: rating.value,
        comment:comment.value.trim(),
        responseRate:responseRate,
        onTimeDelivery: onTimeDelivery,
        responseRating: responseRating.value,
        conditionRating: conditionRating.value
    })
    await markRentalAsReviewed(props.rentalId)
    alert('Review submitted!')
    handleCancel()
    emit('success')
    submitting.value = false
}
const markRentalAsReviewed = async (rentalId) => {
    const rentalRef = doc(db, 'rentals', rentalId)
    await updateDoc(rentalRef, {
        hasReview: true,
        reviewedAt: serverTimestamp()
    })
}
</script>