import { apiClient } from './client';
import type { Trip, City, Bus, Driver } from '@mishwari/types';

export interface TripStop {
  id?: number;
  city: number;
  stop_order: number;
  arrival_time?: string;
  price?: number;
}

export interface CreateTripPayload {
  bus: number | null;
  driver: number | null;
  from_city: number;
  to_city: number;
  trip_type: 'scheduled' | 'flexible';
  journey_date: string;
  planned_departure?: string;
  departure_window_start?: string;
  departure_window_end?: string;
  price?: number;
  stops?: TripStop[];
}

export const tripsApi = {
  list: (params?: { status?: string; bus?: number; driver?: number }) =>
    apiClient.get<Trip[]>('/operator/trips/', { params }).then(res => res.data),

  getById: (id: number) =>
    apiClient.get<Trip>(`/trips/${id}/`).then(res => res.data),

  create: (data: CreateTripPayload) =>
    apiClient.post<Trip>('/operator/trips/', data).then(res => res.data),

  update: (id: number, data: Partial<CreateTripPayload>) =>
    apiClient.patch<Trip>(`/operator/trips/${id}/`, data).then(res => res.data),

  delete: (id: number) =>
    apiClient.delete(`/operator/trips/${id}/`),

  getCities: () =>
    apiClient.get<City[]>('/city-list/').then(res => res.data),

  // Search trips (supports partial journeys and SEO-friendly from-only or to-only queries)
  search: (params: { pickup?: string; destination?: string; date?: string; from?: string; to?: string }) =>
    apiClient.get<TripSearchResult[]>('/trips/', {
      params: { 
        from_city: params.pickup, 
        to_city: params.destination, 
        date: params.date,
        from: params.from,
        to: params.to
      }
    }).then(res => res.data),

  // Get departure cities with trip counts
  getDepartureCities: (date: string) =>
    apiClient.get<CityWithTripCount[]>('/city-list/departure-cities/', {
      params: { date }
    }).then(res => res.data),

  // Get destination cities with trip counts based on departure city
  getDestinationCities: (fromCity: string, date: string) =>
    apiClient.get<CityWithTripCount[]>('/city-list/destination-cities/', {
      params: { from_city: fromCity, date }
    }).then(res => res.data),
};

export interface CityWithTripCount {
  id: number;
  city: string;
  trip_count: number;
}

export interface TripSearchResult {
  trip_id: number;
  from_stop_id: number;
  to_stop_id: number;
  from_city: string;
  to_city: string;
  departure_time: string;
  arrival_time: string;
  available_seats: number;
  fare: number;
  price: number;
  bus: { id: number; bus_number: string; capacity: number } | null;
  driver: { id: number; name: string } | null;
  trip_type: 'scheduled' | 'flexible';
  status: string;
}
