import { useTripBookings, usePhysicalBooking } from '@mishwari/features-bookings';

// Bridge hook that provides booking functionality for drivers
export const useBookingManager = () => {
  const tripBookings = useTripBookings();
  const physicalBooking = usePhysicalBooking();

  return {
    // Trip bookings
    bookings: tripBookings.bookings,
    bookingsLoading: tripBookings.loading,
    bookingsError: tripBookings.error,
    fetchBookings: tripBookings.fetchBookings,
    getBookingById: tripBookings.getBookingById,
    
    // Physical booking creation
    createLoading: physicalBooking.loading,
    createError: physicalBooking.error,
    createPhysicalBooking: physicalBooking.createPhysicalBooking,
  };
};
