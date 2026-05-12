import api from './api';

export const adminApi = {
  getPendingOwners: () => api.get('/Admin/pending-owners'),

  manageOwner: (id, approve) =>
    api.post(`/Admin/manage-owner/${id}`, approve, {
      headers: { 'Content-Type': 'application/json' },
    }),

  getPendingCars: () => api.get('/Admin/pending-cars'),

  manageCarPost: (id, approve) =>
    api.patch(`/Cars/manage-post/${id}`, approve, {
      headers: { 'Content-Type': 'application/json' },
    }),

  getPendingLicenses: () => api.get('/Admin/pending-licenses'),

  verifyLicense: (id, approve) =>
    api.post(`/Admin/verify-license/${id}`, approve, {
      headers: { 'Content-Type': 'application/json' },
    }),

  getAllUserPermissions: () => api.get('/Admin/permissions'),

  updateUserPermissions: (id, data) =>
    api.patch(`/Admin/permissions/${id}`, data),
};
