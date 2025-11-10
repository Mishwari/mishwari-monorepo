import { useState, useCallback } from 'react';
import { useTrips } from '../core/useTrips';

export const useTripSearch = () => {
  const { cities, loading, error, fetchCities, searchTrips } = useTrips();
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const switchCities = useCallback(() => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  }, [fromCity, toCity]);

  const search = useCallback(async () => {
    if (!fromCity || !toCity) {
      throw new Error('Please select both cities');
    }
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    return await searchTrips({
      pickup: fromCity,
      destination: toCity,
      date: dateStr,
    });
  }, [fromCity, toCity, selectedDate, searchTrips]);

  return {
    cities,
    fromCity,
    toCity,
    selectedDate,
    loading,
    error,
    setFromCity,
    setToCity,
    setSelectedDate,
    switchCities,
    fetchCities,
    search,
  };
};
