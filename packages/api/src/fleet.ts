import { apiClient } from './client';
import type { Bus } from '@mishwari/types';

export const fleetApi = {
  list: () =>
    apiClient.get<Bus[]>('/operator/fleet/').then(res => res.data),

  getById: (id: number) =>
    apiClient.get<Bus>(`/operator/fleet/${id}/`).then(res => res.data),

  create: (data: { bus_number: string; bus_type: string; capacity: number; amenities?: any }) =>
    apiClient.post<Bus>('/operator/fleet/', data).then(res => res.data),

  update: (id: number, data: Partial<Bus>) =>
    apiClient.patch<Bus>(`/operator/fleet/${id}/`, data).then(res => res.data),

  delete: (id: number) =>
    apiClient.delete(`/operator/fleet/${id}/`),
};
