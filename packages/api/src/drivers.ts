import { apiClient } from './client';
import type { Driver } from '@mishwari/types';

export const driversApi = {
  list: () =>
    apiClient.get<Driver[]>('/operator/drivers/').then(res => res.data),

  getById: (id: number) =>
    apiClient.get<Driver>(`/operator/drivers/${id}/`).then(res => res.data),

  invite: (phone: string) =>
    apiClient.post('/operator/drivers/invite/', { phone }).then(res => res.data),

  uploadDocuments: (driverId: number, files: FormData) =>
    apiClient.post<Driver>(`/operator/drivers/${driverId}/verify/`, files, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data),
};
