import api from './api';

export const browsingApi = {
  getAll: () => api.get('/Browsing/all'),
  filter: (params) => api.get('/Browsing/filter', { params }),
  getById: (id) => api.get(`/Browsing/${id}`),
};
