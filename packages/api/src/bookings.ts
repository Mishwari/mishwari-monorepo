import { apiClient } from './client';

export const bookingsApi = {
  create: (data: any) =>
    apiClient.post('/booking/', data),

  getById: (id: number) =>
    apiClient.get(`/booking/${id}/`),

  getMyBookings: () =>
    apiClient.get('/booking/'),

  getAll: (token?: string) =>
    apiClient.get('/booking/'),
};
