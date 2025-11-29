import { apiClient } from './client';
import type { Trip, Bus, Driver } from '@mishwari/types';

export interface RouteAlternative {
  route_index: number;
  summary: string;
  distance_km: number;
  duration_min: number;
  polyline: string;
}

export interface RouteDetectionResult {
  session_id: string;
  from_city: { id: number; name: string };
  to_city: { id: number; name: string };
  routes: RouteAlternative[];
}

export interface Waypoint {
  city_id: number;
  city_name: string;
  distance_from_start_km: number;
}

export interface WaypointDetectionResult {
  route_index: number;
  route_summary: string;
  total_distance_km: number;
  total_duration_min: number;
  waypoints: Waypoint[];
}

export interface CreateTripWithStopsPayload {
  session_id: string;
  route_index: number;
  bus: number;
  journey_date: string;
  planned_departure?: string;
  departure_window_start?: string;
  departure_window_end?: string;
  total_price: number;
  trip_type: 'scheduled' | 'flexible';
  selected_waypoints: number[];
  custom_prices?: Record<number, number>;
  auto_publish?: boolean;
}

export const operatorApi = {
  getTripById: (tripId: number) =>
    apiClient.get<Trip>(`/operator/trips/${tripId}/`).then(res => res.data),

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

  getBookingById: (id: number) =>
    apiClient.get(`/operator/bookings/${id}/`).then(res => res.data),

  getTripBookings: (tripId: number) =>
    apiClient.get(`/operator/trips/${tripId}/bookings/`).then(res => res.data),

  createPhysicalBooking: (data: {
    trip: number;
    from_stop: number;
    to_stop: number;
    passengers: Array<{ name: string; age?: number; gender?: string }>;
    contact_name?: string;
    contact_phone?: string;
    contact_email?: string;
    payment_method: 'cash' | 'wallet';
    total_fare: number;
  }) => apiClient.post('/operator/physical-bookings/', data),

  // Upgrade
  submitUpgradeRequest: (data: {
    company_name: string;
    commercial_registration: string;
    tax_number?: string;
    documents: Record<string, string>;
  }) => apiClient.post('/operator/upgrade/', data),

  getUpgradeStatus: () =>
    apiClient.get('/operator/upgrade/status/'),

  // Route detection and trip creation
  detectRoutes: (fromCityId: number, toCityId: number) =>
    apiClient.get<RouteDetectionResult>('/operator/trips/detect-routes/', {
      params: { from_city: fromCityId, to_city: toCityId }
    }).then(res => res.data),

  detectWaypoints: (sessionId: string, routeIndex: number) =>
    apiClient.get<WaypointDetectionResult>('/operator/trips/detect-waypoints/', {
      params: { session_id: sessionId, route_index: routeIndex }
    }).then(res => res.data),

  createTripWithStops: (data: CreateTripWithStopsPayload) =>
    apiClient.post<Trip>('/operator/trips/create-with-stops/', data).then(res => res.data),

  cancelTrip: (tripId: number) =>
    apiClient.patch<Trip>(`/operator/trips/${tripId}/`, { status: 'cancelled' }).then(res => res.data),
};
