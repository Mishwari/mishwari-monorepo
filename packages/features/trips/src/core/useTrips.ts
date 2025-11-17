import { useState, useCallback } from 'react';
import { tripsApi } from '@mishwari/api';

export const useTrips = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = useCallback(async () => {
    try {
      const citiesData = await tripsApi.getCities();
      setCities(citiesData);
      return citiesData;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cities');
      return [];
    }
  }, []);

  const searchTrips = useCallback(async (params: {
    pickup?: string;
    destination?: string;
    date?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripsApi.search(params);
      setTrips(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to search trips');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getTripById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripsApi.getById(id);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch trip');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    trips,
    cities,
    loading,
    error,
    fetchCities,
    searchTrips,
    getTripById,
  };
};
