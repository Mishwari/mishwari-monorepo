import { useTripSearch, useTripsFilter, useTripsSort } from '@mishwari/features-trips';

// Bridge hook for passenger trip operations
export const useTripManager = () => {
  const tripSearch = useTripSearch();
  const tripsFilter = useTripsFilter();
  const tripsSort = useTripsSort();

  return {
    // Search
    cities: tripSearch.cities,
    fromCity: tripSearch.fromCity,
    toCity: tripSearch.toCity,
    selectedDate: tripSearch.selectedDate,
    loading: tripSearch.loading,
    error: tripSearch.error,
    setFromCity: tripSearch.setFromCity,
    setToCity: tripSearch.setToCity,
    setSelectedDate: tripSearch.setSelectedDate,
    switchCities: tripSearch.switchCities,
    fetchCities: tripSearch.fetchCities,
    search: tripSearch.search,
    
    // Filter
    filterTrips: tripsFilter.filterTrips,
    
    // Sort
    sortTrips: tripsSort.sortTrips,
  };
};
