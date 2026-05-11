import api from './api';
import type { Review, ReviewCreateDto } from '../types';

export const reviewApi = {
  getByCar: (carId: number) => api.get<Review[]>(`/Review/car/${carId}`),
   create: (data: ReviewCreateDto) => api.post('/Review', data),
};