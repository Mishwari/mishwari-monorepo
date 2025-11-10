import { useState, useCallback } from 'react';
import { tripsApi } from '@mishwari/api';

export const useTripManagement = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tripsApi.getMyTrips();
      setTrips(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTrip = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tripsApi.create(data);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create trip');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTrip = useCallback(async (id: number, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tripsApi.update(id, data);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update trip');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTrip = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await tripsApi.delete(id);
    } catch (err: any) {
      setError(err.message || 'Failed to delete trip');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    trips,
    loading,
    error,
    fetchMyTrips,
    createTrip,
    updateTrip,
    deleteTrip,
  };
};
