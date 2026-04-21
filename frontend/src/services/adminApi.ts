import api from './api';

export const adminApi = {
  // GET /api/Admin/pending-owners
  getPendingOwners: () => api.get('/Admin/pending-owners'),
  

  // POST /api/Admin/manage-owner/{id} (body: boolean)
  manageOwner: (id: number, approve: boolean) =>
    api.post(`/Admin/manage-owner/${id}`, approve, {
      headers: { 'Content-Type': 'application/json' },
    }),

  // GET /api/Browsing/all (used to fetch cars, then filter client-side for pending)
  getPendingCars: () => api.get('/Admin/pending-cars'),
  manageCarPost: (id: number, approve: boolean) =>
    api.patch(`/Cars/manage-post/${id}`, approve, {
      headers: { 'Content-Type': 'application/json' },
    }),
    

  
};