import { useTripManagement, useTripActions } from '@mishwari/features-trips';

// Bridge hook for driver trip operations
export const useTripManager = () => {
  const tripManagement = useTripManagement();
  const tripActions = useTripActions();

  return {
    // Management
    trips: tripManagement.trips,
    loading: tripManagement.loading,
    error: tripManagement.error,
    fetchMyTrips: tripManagement.fetchMyTrips,
    createTrip: tripManagement.createTrip,
    updateTrip: tripManagement.updateTrip,
    deleteTrip: tripManagement.deleteTrip,
    
    // Actions
    actionsLoading: tripActions.loading,
    actionsError: tripActions.error,
    publishTrip: tripActions.publishTrip,
    departNow: tripActions.departNow,
  };
};
