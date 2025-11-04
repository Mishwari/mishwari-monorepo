import { apiClient } from './client';

export const tripsApi = {
  search: (params: { from_city: string; to_city: string; date?: string }) => 
    apiClient.get('/trips/', { params }),
  
  getById: (id: number) => 
    apiClient.get(`/trips/${id}/`),
};

export const citiesApi = {
  getAll: () => 
    apiClient.get('/city-list/'),
};