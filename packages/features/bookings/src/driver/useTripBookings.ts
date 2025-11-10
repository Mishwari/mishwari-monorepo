import { useState, useCallback } from 'react';
import { operatorApi } from '@mishwari/api';

export const useTripBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async (params?: { trip?: number; date?: string; status?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await operatorApi.getBookings(params);
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
      const response = await operatorApi.getBookingById(id);
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
