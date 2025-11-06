import { apiClient } from './client';

export const operatorApi = {
  // Trips
  getTrips: () => apiClient.get('/driver-trips/'),
  createTrip: (data: any) => apiClient.post('/test-create/', data),
  updateTripStatus: (id: number, status: string) => 
    apiClient.patch(`/driver-trips/${id}/`, { trip_status: status }),
  
  // Fleet (placeholder for future)
  getFleet: () => apiClient.get('/operator/fleet/'),
  
  // Physical Bookings (placeholder for future)
  createPhysicalBooking: (data: any) => apiClient.post('/operator/bookings/', data),
};
