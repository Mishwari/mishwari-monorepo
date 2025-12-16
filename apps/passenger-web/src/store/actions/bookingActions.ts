import { bookingsApi, apiClient } from '@mishwari/api';
import { AppState, AppStore } from '../store';
import { setStatus, setError, resetBookingCreationState } from "../slices/bookingCreationSlice";
import { Passenger } from "@/types/passenger";
import { Stripe } from '@stripe/stripe-js';

export const createBooking = (stripe: Stripe | null, fromStopId?: number, toStopId?: number) => async (dispatch:AppState, getState: () => AppStore)  =>{
    const {bookingCreation, auth, user} = getState();

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

    // Use provided stop IDs or get from trip stops
    if (!fromStopId || !toStopId) {
        if (bookingCreation.trip.stops && bookingCreation.trip.stops.length > 0) {
            const sortedStops = [...bookingCreation.trip.stops].sort((a: any, b: any) => a.sequence - b.sequence);
            fromStopId = sortedStops[0].id;
            toStopId = sortedStops[sortedStops.length - 1].id;
        } else {
            alert('Stop information is missing');
            dispatch(setError('Stop information is missing'));
            return;
        }
    }
    
    // Calculate fare based on stops
    const fromStop = bookingCreation.trip.stops?.find((s: any) => s.id === fromStopId);
    const toStop = bookingCreation.trip.stops?.find((s: any) => s.id === toStopId);
    const segmentPrice = toStop && fromStop ? toStop.price_from_start - fromStop.price_from_start : Number(bookingCreation.trip.price);
    const passengerCount = bookingCreation.passengers.filter((p:Passenger) => p.is_checked).length;

    // Get contact details from session storage
    const draft = sessionStorage.getItem('bookingDraft');
    let contactDetails = { name: '', phone: '', email: '' };
    if (draft) {
        const draftData = JSON.parse(draft);
        contactDetails = draftData.contactDetails || contactDetails;
    }

    const bookingData = {
        user: user.userDetails.id,
        trip: bookingCreation.trip.id,
        from_stop: fromStopId,
        to_stop: toStopId,
        passengers: bookingCreation.passengers.filter((p:Passenger) => p.is_checked),
        contact_name: contactDetails.name,
        contact_phone: contactDetails.phone,
        contact_email: contactDetails.email,
        total_fare: passengerCount * segmentPrice,
        is_paid: bookingCreation.isPaid,
        payment_method: bookingCreation.paymentMethod,
    };
    
    try {
        dispatch(setStatus('loading'));
        const response = await bookingsApi.create(bookingData);
        dispatch(setStatus('succeeded'));
        if (bookingData.payment_method === 'stripe' && response.payment_url) {
            window.location.href = response.payment_url;
        } else {
            window.location.href = `/checkout/success?booking_id=${response.id}`;
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
