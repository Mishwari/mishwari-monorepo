import { useState, useEffect } from 'react';
import { Trip } from '@mishwari/types';

export type SortOption = 'departure' | 'arrival' | 'price' | 'rating';

export const useTripsSort = (trips: Trip[]) => {
  const [sortBy, setSortBy] = useState<SortOption>('departure');
  const [sortedTrips, setSortedTrips] = useState<Trip[]>(trips);

  useEffect(() => {
    const sorted = [...trips].sort((a, b) => {
      switch (sortBy) {
        case 'departure':
          return new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime();
        case 'arrival':
          return new Date(a.arrival_time).getTime() - new Date(b.arrival_time).getTime();
        case 'price':
          return a.price - b.price;
        case 'rating':
          return Number(b.driver?.driver_rating || 0) - Number(a.driver?.driver_rating || 0);
        default:
          return 0;
      }
    });
    
    setSortedTrips(sorted);
  }, [trips, sortBy]);

  return { sortedTrips, sortBy, setSortBy };
};
