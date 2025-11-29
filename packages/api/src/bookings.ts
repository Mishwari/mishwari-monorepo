import { apiClient } from './client';
import type { Booking } from '@mishwari/types';

export interface CreateBookingPayload {
  trip: number;
  from_stop: number;
  to_stop: number;
  passengers: Array<{
    name: string;
    age?: number;
    gender?: 'male' | 'female';
    is_checked?: boolean;
  }>;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  total_fare: number;
  payment_method: 'cash' | 'wallet' | 'stripe';
}

export const bookingsApi = {
  create: (data: CreateBookingPayload) =>
    apiClient.post<Booking>('/booking/', data).then(res => res.data),

  getById: (id: number) =>
    apiClient.get<Booking>(`/booking/${id}/`).then(res => res.data),

  getMyBookings: () =>
    apiClient.get<Booking[]>('/booking/').then(res => res.data),

  getAll: () =>
    apiClient.get<Booking[]>('/booking/').then(res => res.data),

  cancel: (id: number) =>
    apiClient.post(`/booking/${id}/cancel/`).then(res => res.data),
};
