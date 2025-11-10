import { useState, useCallback } from 'react';
import { bookingsApi } from '@mishwari/api';

export const useMyBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookingsApi.getMyBookings();
      setBookings(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  const getBookingById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookingsApi.getById(id);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch booking');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    getBookingById,
  };
};
