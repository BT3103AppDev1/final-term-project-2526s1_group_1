import {ref} from 'vue'
import {db} from '@/firebase/config'
import {collection,query,where,getDocs, doc} from 'firebase/firestore'
import {useListings} from './useListings'
import {useReviews} from './useReviews'

export function useUserStats(){
    const loading=ref (false)//pulls data instantly
    const error = ref(null)//holds error
    const {getUserListings}= useListings()
    const {getUserReviews, getUserAverageRating}= useReviews()
    const calcStats = async(userId)=> {
        loading.value=true
        const listings = await getUserListings(userId)
        const reviews = await getUserReviews(userId)
        const ratingData = await getUserAverageRating(userId)
        //get rentals when user is 'owner'
        const borrowQuery = query(
            collection(db, 'rentals'), where('borrowerId', '==', userId)
        )
        const borrowerRent= await getDocs(borrowQuery)

        const ownerQuery = query(
            collection(db, 'rentals'), where('lenderId', '==', userId)
        )
        const ownerRent= await getDocs(ownerQuery)
        //calc earnings and transac
        let totalEarnings = 0
        let successfulDeals = 0
        ownerRent.forEach(doc => {
            const rental = doc.data()
            if(rental.status === 'Approved'||rental.status ==='Completed'){
                totalEarnings += rental.totalCost ??0
                successfulDeals++
            }else{totalEarnings+=0}
        })
        //num items borrowed
        let itemsRented= 0
    borrowerRent.forEach(doc => {
        const rental = doc.data()
        if(rental.status === 'Approved'||rental.status ==='Completed'){
            itemsRented++}
    })
    //stats object
    const stats = {
        itemsListed: listings.length,
        itemsRented: itemsRented,
        totalEarnings: totalEarnings,
        successfulTransactions: successfulDeals,
        averageRating: ratingData.average,
        totalReviews: ratingData.total,
        responseRate: 98,
        completionRate:100,
        repeatCustomerRate:35
    }
    loading.value=false
    return stats
    }
    return{
        loading, error, calcStats
    }
}
