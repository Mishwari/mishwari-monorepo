import { useState, useEffect } from 'react';
import { Trip } from '@mishwari/types';

interface FilterOptions {
  busTypes: string[];
  ratings: number[];
  minPrice: number;
  maxPrice: number;
}

export const useTripsFilter = (trips: Trip[]) => {
  const [filters, setFilters] = useState<FilterOptions>({
    busTypes: [],
    ratings: [],
    minPrice: 0,
    maxPrice: Infinity,
  });

  const [filteredTrips, setFilteredTrips] = useState<Trip[]>(trips);

  useEffect(() => {
    const filtered = trips.filter((trip) => {
      const matchesBusType = filters.busTypes.length === 0 || filters.busTypes.includes(trip.bus?.bus_type || '');
      const matchesRating = filters.ratings.length === 0 || Number(trip.driver?.driver_rating || 0) >= Math.min(...filters.ratings);
      const matchesPrice = Number(trip.price) >= filters.minPrice && Number(trip.price) <= filters.maxPrice;
      
      return matchesBusType && matchesRating && matchesPrice;
    });
    
    setFilteredTrips(filtered);
  }, [trips, filters]);

  return { filteredTrips, filters, setFilters };
};
