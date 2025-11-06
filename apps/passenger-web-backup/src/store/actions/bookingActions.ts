import axios from "axios";
import { AppState, AppStore } from '../store';
import { setStatus, setError, resetBookingCreationState } from "../slices/bookingCreationSlice";
import { Passenger } from "@/types/passenger";
import { Stripe } from '@stripe/stripe-js';
import { encryptToken, decryptToken } from '@/utils/tokenUtils';



export const createBooking = (stripe: Stripe | null) => async (dispatch:AppState, getState: () => AppStore)  =>{
    const {bookingCreation, auth, user, selectedTrip, passengers} = getState();
    console.log(bookingCreation)

    if(!auth.isAuthenticated) {
        dispatch(setError('User is not authenticated'))
        return;
    }
    const bookingData = {
         user: user.userDetails.id,
        trip:bookingCreation.trip.id,
        passengers: bookingCreation.passengers.filter((p:Passenger) => p.is_checked), // is_checked is true
        amount: (bookingCreation.passengers.filter((p:Passenger) => p.is_checked).length * Number(bookingCreation.trip.price)),
        is_paid: bookingCreation.isPaid,
        payment_method:bookingCreation.paymentMethod,

    }
    try {
        // console.log("bookingData", bookingData)
        // dispatch(setStatus('loading'));
        const response = await axios.post('/api/next-external/booking/createBooking/', bookingData
        , {
          headers: {
            Authorization: `Bearer ${decryptToken(auth.token)}`,
          },
        }
      );
      console.log('payment_url', response.data.payment_url);
      if (response.status === 200) {
          if (bookingData.payment_method === 'stripe') {

            window.location.href = response.data.payment_url;
          } else{
            window.location.href = '/checkout/success'
          }
        // const { payment_url } = response.data.payment_url;
      } else {
        console.error('Unexpected response:', response);
        window.location.href = '/checkout/cancel'
      }

      // if (stripe) {
      //   const result = await stripe.redirectToCheckout({
      //     sessionId: session.id,
      //   });
  
      //   if (result.error) {
      //     throw new Error(result.error.message);
      //   }
      // }
      
        // dispatch(setStatus('succeeded'));
        // dispatch(resetBookingCreationState());
      } catch (error: any) {
        console.log("failed to pay")
        console.error('Error creating booking:', error);
        dispatch(setStatus('failed'));
        dispatch(setError(error.response?.data?.message || 'Booking creation failed'));
        window.location.href = '/checkout/cancel'
      } 

}
