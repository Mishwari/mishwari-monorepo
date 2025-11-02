import { apiClient } from './client';

export const tripsApi = {
  search: (params: { pickup: string; destination: string; date?: string }) => 
    apiClient.get('/trips/', { params }),
  
  getById: (id: number) => 
    apiClient.get(`/trips/${id}/`),
};

export const citiesApi = {
  getAll: () => 
    apiClient.get('/city-list/'),
};