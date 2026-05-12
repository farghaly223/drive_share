import api from './api';
export const carsApi = {
  create: (data) => api.post('/Cars', data),
  managePost: (id, publish) => api.patch(`/Cars/manage-post/${id}`, publish, { headers: { 'Content-Type': 'application/json' } }),
  delete: (id) => api.delete(`/Cars/${id}`),
  getMyCars: () => api.get('/Cars/my'),
  update: (id, data) => api.put(`/Cars/${id}`, data),
};