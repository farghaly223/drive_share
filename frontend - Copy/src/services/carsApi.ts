import api from './api';
import type { CarCreateUpdateDto } from '../types';

export const carsApi = {
  create: (data: CarCreateUpdateDto) => api.post('/Cars', data),
  managePost: (id: number, publish: boolean) =>
    api.patch(`/Cars/manage-post/${id}`, publish, {
      headers: { 'Content-Type': 'application/json' },
    }),
  delete: (id: number) => api.delete(`/Cars/${id}`),
  getMyCars: () => api.get('/Cars/my'),   // Adjust if backend uses different endpoint
  update: (id: number, data: CarCreateUpdateDto) => api.put(`/Cars/${id}`, data),
};