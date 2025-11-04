import { apiClient } from './client';

export const profileApi = {
  get: () =>
    apiClient.get('/profile/'),

  update: (data: any) =>
    apiClient.put('/profile/', data),
};

export const userApi = {
  get: () =>
    apiClient.get('/user/'),
};
