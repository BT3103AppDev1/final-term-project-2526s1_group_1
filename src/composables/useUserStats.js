import { ref } from 'vue'
import { db } from '@/firebase/config'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useListings } from './useListings'
import { useReviews } from './useReviews'

export function useUserStats() {
    const loading = ref(false)
    const error = ref(null)
    const {getUserListings}= useListings()
    const {getUserReviews,getUserAverageRating} = useReviews()
    const calcStats = async(userId) => {
        loading.value = true
        const listings = await getUserListings(userId)
        const reviews = await getUserReviews(userId)
        const ratingData = await getUserAverageRating(userId)
        const rentalsQuery = query(//rentals where user is lender
            collection(db, 'rentals'), where('lenderId', '==', userId))
        const rentalsSnap = await getDocs(rentalsQuery)

        let itemsRented = 0
        let successfulDeals = 0
        let totalEarnings = 0
        rentalsSnap.forEach(doc => {
        const rental = doc.data()
        if (rental.status==='Approved' ||rental.status==='Completed') {itemsRented++}
        if (rental.status === 'Completed') {successfulDeals++
            totalEarnings += rental.totalCost||0}
        })
        console.log('Items rented out:', itemsRented)
        console.log('Successful deals:', successfulDeals)
        console.log('Total earnings:', totalEarnings)
        let totalResponseRating = 0//calc ave ratings from reviews
        let totalConditionRating = 0
        let validResponseRatings = 0
        let validConditionRatings = 0
        reviews.forEach(review => {
        if (review.responseRating && review.responseRating > 0) {
            totalResponseRating += review.responseRating
            validResponseRatings++
        } else if (review.responseRate && review.responseRate > 0) {
            const starRating = Math.ceil(review.responseRate / 20)//convert % to stars(1-5)
            totalResponseRating += starRating
            validResponseRatings++
        }
        if (review.conditionRating && review.conditionRating>0) {
            totalConditionRating += review.conditionRating
            validConditionRatings++
        } else if (review.onTimeDelivery && review.onTimeDelivery>0) {
            const starRating = Math.ceil(review.onTimeDelivery/20)
            totalConditionRating += starRating
            validConditionRatings++
        }
    })
      //convert ave star ratings to %
    const avgResponseStars = validResponseRatings > 0? totalResponseRating/validResponseRatings: 0
    const avgConditionStars = validConditionRatings > 0? totalConditionRating/validConditionRatings: 0
    loading.value = false
    return {
        itemsListed: listings.length,
        itemsRented: itemsRented,
        totalEarnings: totalEarnings,
        successfulTransactions: successfulDeals,
        averageRating: ratingData.average,
        totalReviews: ratingData.total,
        responseRate: Math.min(Math.round(avgResponseStars*20),100),
        completionRate: Math.min(Math.round(avgConditionStars*20),100),
        customerSatisfaction: ratingData.average,
        }
    }
    return {loading,error,calcStats}}
