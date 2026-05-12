import api from './api';
import type { CarListingDTO } from '../types';

export const browsingApi = {
  getAll: () => api.get<CarListingDTO[]>('/Browsing/all'),
  filter: (params: {
    search?: string;
    maxPrice?: number;
    location?: string;
    carType?: string;
  }) => api.get<CarListingDTO[]>('/Browsing/filter', { params }),
  getById: (id: number) => api.get<CarListingDTO>(`/Browsing/${id}`),
};