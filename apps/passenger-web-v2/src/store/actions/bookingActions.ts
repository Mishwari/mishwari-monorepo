import { bookingsApi, apiClient } from '@mishwari/api';
import { AppState, AppStore } from '../store';
import { setStatus, setError, resetBookingCreationState } from "../slices/bookingCreationSlice";
import { Passenger } from "@/types/passenger";
import { Stripe } from '@stripe/stripe-js';

export const createBooking = (stripe: Stripe | null) => async (dispatch:AppState, getState: () => AppStore)  =>{
    const {bookingCreation, auth, user} = getState();

    console.log('Creating booking, trip data:', bookingCreation.trip);

    if(!auth.isAuthenticated) {
        alert('User is not authenticated');
        dispatch(setError('User is not authenticated'));
        return;
    }
    if (!bookingCreation.trip?.id) {
        alert('Trip information is missing');
        dispatch(setError('Trip information is missing'));
        return;
    }

    // Fetch trip stops from backend
    let fromStopId, toStopId;
    try {
        const stopsResponse = await apiClient.get(`trip-stops/?trip=${bookingCreation.trip.id}`);
        const stops = stopsResponse.data;
        console.log('Fetched stops:', stops);
        
        if (!stops || stops.length === 0) {
            alert('No stops found for this trip');
            dispatch(setError('No stops found for this trip'));
            return;
        }
        
        // Sort by sequence to get first and last
        const sortedStops = stops.sort((a: any, b: any) => a.sequence - b.sequence);
        fromStopId = sortedStops[0].id;
        toStopId = sortedStops[sortedStops.length - 1].id;
        console.log('Using stops - from:', fromStopId, 'to:', toStopId);
        console.log('Stop details:', sortedStops[0], sortedStops[sortedStops.length - 1]);
    } catch (error: any) {
        console.error('Error fetching stops:', error);
        alert('Failed to fetch trip stops');
        dispatch(setError('Failed to fetch trip stops'));
        return;
    }

    const bookingData = {
        user: user.userDetails.id,
        trip: bookingCreation.trip.id,
        from_stop: fromStopId,
        to_stop: toStopId,
        passengers: bookingCreation.passengers.filter((p:Passenger) => p.is_checked),
        total_fare: (bookingCreation.passengers.filter((p:Passenger) => p.is_checked).length * Number(bookingCreation.trip.price)),
        is_paid: bookingCreation.isPaid,
        payment_method: bookingCreation.paymentMethod,
    };
    
    console.log('Sending booking data:', JSON.stringify(bookingData, null, 2));

    try {
        dispatch(setStatus('loading'));
        const response = await bookingsApi.create(bookingData);
        if (response.status === 200 || response.status === 201) {
            dispatch(setStatus('succeeded'));
            if (bookingData.payment_method === 'stripe' && response.data.payment_url) {
                window.location.href = response.data.payment_url;
            } else {
                window.location.href = '/checkout/success';
            }
        }
    } catch (error: any) {
        console.error('Booking creation error:', error.response?.status, error.response?.data);
        localStorage.setItem('lastBookingError', JSON.stringify({
            error: error.response?.data,
            bookingData,
            stops: { fromStopId, toStopId }
        }));
        dispatch(setStatus('failed'));
        dispatch(setError(error.response?.data?.[0] || error.response?.data?.message || 'فشل إنشاء الحجز'));
        setTimeout(() => window.location.href = '/checkout/cancel', 500);
    }
};
