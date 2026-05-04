import api from './api';
import type { UserRegisterDto, UserLoginDto, LoginResponse , UserWithPermissions} from '../types'

export const authApi = {
  register: (data: UserRegisterDto) => api.post('/Auth/register', data),
  login: (data: UserLoginDto) => api.post<LoginResponse>('/Auth/login', data),
  me: () => api.get('/Auth/me'),
  adminOnly: () => api.get('/Auth/admin-only'),
  ownerAccess: () => api.get('/Auth/owner-access'),
  
  // GET /api/Auth/debug/roles – returns { message, users: [...] }
  debugRoles: () => api.get('/Auth/debug/roles'),
  
  // PUT /api/Auth/update-role/{userId} (body: string role)
  updateRole: (userId: number, role: string) =>
    api.put(`/Auth/update-role/${userId}`, JSON.stringify(role), {
      headers: { 'Content-Type': 'application/json' },
    }),

  // Convenience wrapper for getting all users from debug/roles
  getAllUsers: async (): Promise<UserWithPermissions[]> => {
  const res = await api.get('/Auth/debug/roles');
  return res.data.users;
},

  // Alias for updateRole
  updateUserRole: (userId: number, role: string) =>
    api.put(`/Auth/update-role/${userId}`, JSON.stringify(role), {
      headers: { 'Content-Type': 'application/json' },
    }),

    uploadLicense: (licenseUrl: string) =>
    api.post('/Auth/upload-license', JSON.stringify(licenseUrl), {
      headers: { 'Content-Type': 'application/json' },
    }),
};