import api from './api';

export const authApi = {
  register: (data) => api.post('/Auth/register', data),
  login: (data) => api.post('/Auth/login', data),
  me: () => api.get('/Auth/me'),
  adminOnly: () => api.get('/Auth/admin-only'),
  ownerAccess: () => api.get('/Auth/owner-access'),
  debugRoles: () => api.get('/Auth/debug/roles'),

  updateRole: (userId, role) =>
    api.put(`/Auth/update-role/${userId}`, JSON.stringify(role), {
      headers: { 'Content-Type': 'application/json' },
    }),

  getAllUsers: async () => {
    const res = await api.get('/Auth/debug/roles');
    return res.data.users;
  },

  updateUserRole: (userId, role) =>
    api.put(`/Auth/update-role/${userId}`, JSON.stringify(role), {
      headers: { 'Content-Type': 'application/json' },
    }),

  uploadLicense: (licenseUrl) =>
    api.post('/Auth/upload-license', JSON.stringify(licenseUrl), {
      headers: { 'Content-Type': 'application/json' },
    }),
};
