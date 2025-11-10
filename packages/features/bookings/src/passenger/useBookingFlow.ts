import { useState, useCallback } from 'react';
import { bookingsApi, apiClient } from '@mishwari/api';

interface Passenger {
  id?: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  is_checked?: boolean;
}

interface BookingData {
  user: number;
  trip: number;
  from_stop: number;
  to_stop: number;
  passengers: Passenger[];
  total_fare: number;
  is_paid: boolean;
  payment_method: string;
}

export const useBookingFlow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTripStops = useCallback(async (tripId: number) => {
    try {
      const response = await apiClient.get(`trip-stops/?trip=${tripId}`);
      const stops = response.data;
      
      if (!stops || stops.length === 0) {
        throw new Error('No stops found for this trip');
      }
      
      const sortedStops = stops.sort((a: any, b: any) => a.sequence - b.sequence);
      return {
        fromStopId: sortedStops[0].id,
        toStopId: sortedStops[sortedStops.length - 1].id,
      };
    } catch (err: any) {
      throw new Error('Failed to fetch trip stops');
    }
  }, []);

  const createBooking = useCallback(async (bookingData: BookingData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookingsApi.create(bookingData);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.[0] || err.response?.data?.message || 'Failed to create booking';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchTripStops,
    createBooking,
  };
};
