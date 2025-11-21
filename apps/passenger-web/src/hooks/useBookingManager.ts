import { useMyBookings, useBookingFlow } from '@mishwari/features-bookings';

// Bridge hook that provides booking functionality
export const useBookingManager = () => {
  const myBookings = useMyBookings();
  const bookingFlow = useBookingFlow();

  return {
    // My bookings
    bookings: myBookings.bookings,
    bookingsLoading: myBookings.loading,
    bookingsError: myBookings.error,
    fetchBookings: myBookings.fetchBookings,
    getBookingById: myBookings.getBookingById,
    
    // Booking creation
    createLoading: bookingFlow.loading,
    createError: bookingFlow.error,
    fetchTripStops: bookingFlow.fetchTripStops,
    createBooking: bookingFlow.createBooking,
  };
};
