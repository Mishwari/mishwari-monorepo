import { useState, useCallback } from 'react';
import { apiClient } from '@mishwari/api';
import { Passenger } from '@mishwari/types';
import { UsePassengerManagerReturn } from './types';

export const usePassengerManager = (): UsePassengerManagerReturn => {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validatePassenger = useCallback((passenger: Partial<Passenger>) => {
    const errors: string[] = [];
    if (!passenger.name?.trim()) errors.push('Name is required');
    if (!passenger.phone?.trim()) errors.push('Phone is required');
    if (passenger.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email)) {
      errors.push('Invalid email format');
    }
    return { valid: errors.length === 0, errors };
  }, []);

  const checkDuplicate = useCallback((passenger: Partial<Passenger>) => {
    return passengers.some(p => 
      (passenger.phone && p.phone === passenger.phone) ||
      (passenger.email && p.email === passenger.email)
    );
  }, [passengers]);

  const fetchPassengers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('passengers/');
      setPassengers(response.data.map((p: any) => ({
        ...p,
        is_checked: p.is_checked ?? false,
      })));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch passengers');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addPassenger = useCallback(async (passenger: Omit<Passenger, 'id'>) => {
    const validation = validatePassenger(passenger);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('passengers/', passenger);
      const newPassenger = { ...response.data, is_checked: false };
      setPassengers(prev => [...prev, newPassenger]);
      return newPassenger;
    } catch (err: any) {
      setError(err.message || 'Failed to add passenger');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [validatePassenger]);

  const updatePassenger = useCallback(async (id: number, data: Partial<Passenger>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.put(`passengers/${id}/`, data);
      setPassengers(prev => prev.map(p => p.id === id ? { ...p, ...response.data } : p));
    } catch (err: any) {
      setError(err.message || 'Failed to update passenger');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePassenger = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`passengers/${id}/`);
      setPassengers(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete passenger');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkUpdateChecked = useCallback(async (passengers: Passenger[]) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post('passengers/bulk-update-checked/', { passengers });
    } catch (err: any) {
      setError(err.message || 'Failed to update passengers');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleCheck = useCallback((id: number) => {
    setPassengers(prev => prev.map(p => 
      p.id === id ? { ...p, is_checked: !p.is_checked } : p
    ));
  }, []);

  const getCheckedPassengers = useCallback(() => {
    return passengers.filter(p => p.is_checked);
  }, [passengers]);

  return {
    passengers,
    loading,
    error,
    fetchPassengers,
    addPassenger,
    updatePassenger,
    deletePassenger,
    toggleCheck,
    getCheckedPassengers,
    validatePassenger,
    checkDuplicate,
    bulkUpdateChecked,
  };
};
