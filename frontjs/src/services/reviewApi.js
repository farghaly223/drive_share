import api from './api';
export const reviewApi = {
  getByCar: (carId) => api.get(`/Review/car/${carId}`),
  create: (data) => api.post('/Review', data),
};