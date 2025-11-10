import { useState, useCallback } from 'react';
import { operatorApi } from '@mishwari/api';

export const useTripActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publishTrip = useCallback(async (tripId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await operatorApi.publishTrip(tripId);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to publish trip');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const departNow = useCallback(async (tripId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await operatorApi.departNow(tripId);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to depart trip');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    publishTrip,
    departNow,
  };
};
