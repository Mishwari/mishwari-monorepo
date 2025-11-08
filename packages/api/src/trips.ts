import { apiClient } from './client';
import type { Trip, City } from '@mishwari/types';

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
    apiClient.get<Trip>(`/operator/trips/${id}/`).then(res => res.data),

  create: (data: CreateTripPayload) =>
    apiClient.post<Trip>('/operator/trips/', data).then(res => res.data),

  update: (id: number, data: Partial<CreateTripPayload>) =>
    apiClient.patch<Trip>(`/operator/trips/${id}/`, data).then(res => res.data),

  delete: (id: number) =>
    apiClient.delete(`/operator/trips/${id}/`),

  getCities: () =>
    apiClient.get<City[]>('/city-list/').then(res => res.data),
};
