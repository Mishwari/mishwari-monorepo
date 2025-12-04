import { apiClient } from './client';
import type { Driver } from '@mishwari/types';

export const driversApi = {
  list: () =>
    apiClient.get<Driver[]>('/operator/drivers/').then(res => res.data),

  getById: (id: number) =>
    apiClient.get<Driver>(`/operator/drivers/${id}/`).then(res => res.data),

  generateInvite: (mobile_number: string) =>
    apiClient.post('/operator/drivers/generate-invite/', { mobile_number }).then(res => res.data),

  listInvitations: () =>
    apiClient.get('/operator/drivers/invitations/').then(res => res.data),

  cancelInvitation: (id: number) =>
    apiClient.post(`/operator/drivers/${id}/cancel-invite/`).then(res => res.data),

  uploadDocuments: (driverId: number, files: FormData) =>
    apiClient.post<Driver>(`/operator/drivers/${driverId}/verify/`, files, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data),
};
