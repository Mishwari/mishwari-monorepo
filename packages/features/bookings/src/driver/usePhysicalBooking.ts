import { useState, useCallback } from 'react';
import { operatorApi } from '@mishwari/api';

interface PhysicalBookingData {
  trip: number;
  from_stop: number;
  to_stop: number;
  passengers: Array<{
    name: string;
    email: string;
    phone: string;
    age?: number;
    gender?: string;
  }>;
  payment_method: 'cash' | 'wallet';
  total_fare: number;
}

export const usePhysicalBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPhysicalBooking = useCallback(async (data: PhysicalBookingData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await operatorApi.createPhysicalBooking(data);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to create physical booking';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createPhysicalBooking,
  };
};
