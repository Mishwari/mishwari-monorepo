import { apiClient } from './client';
import type { Trip, Bus, Driver } from '@mishwari/types';

export const operatorApi = {
  publishTrip: (tripId: number) =>
    apiClient.post<Trip>(`/operator/trips/${tripId}/publish/`),

  departNow: (tripId: number) =>
    apiClient.post<Trip>(`/operator/trips/${tripId}/depart_now/`),

  uploadBusDocuments: (busId: number, files: FormData) =>
    apiClient.post<Bus>(`/operator/fleet/${busId}/verify/`, files, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  uploadDriverDocuments: (driverId: number, files: FormData) =>
    apiClient.post<Driver>(`/operator/drivers/${driverId}/verify/`, files, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Bookings
  getBookings: (params?: { trip?: number; date?: string; status?: string }) =>
    apiClient.get('/operator/bookings/', { params }),

  getBookingById: (id: number) =>
    apiClient.get(`/operator/bookings/${id}/`),

  createPhysicalBooking: (data: {
    trip: number;
    from_stop: number;
    to_stop: number;
    passengers: Array<{ name: string; email: string; phone: string; age?: number; gender?: string }>;
    payment_method: 'cash' | 'wallet';
    total_fare: number;
  }) => apiClient.post('/operator/bookings/', data),

  // Upgrade
  submitUpgradeRequest: (data: {
    company_name: string;
    commercial_registration: string;
    tax_number?: string;
    documents: Record<string, string>;
  }) => apiClient.post('/operator/upgrade/', data),

  getUpgradeStatus: () =>
    apiClient.get('/operator/upgrade/status/'),
};
