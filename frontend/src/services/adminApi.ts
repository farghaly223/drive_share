import api from "./api";

export const adminApi = {
  // GET /api/Admin/pending-owners
  getPendingOwners: () => api.get("/Admin/pending-owners"),

  // POST /api/Admin/manage-owner/{id} (body: boolean)
  manageOwner: (id: number, approve: boolean) =>
    api.post(`/Admin/manage-owner/${id}`, approve, {
      headers: { "Content-Type": "application/json" },
    }),

  // GET /api/Browsing/all (used to fetch cars, then filter client-side for pending)
  getPendingCars: () => api.get("/Admin/pending-cars"),
  manageCarPost: (id: number, approve: boolean) =>
    api.patch(`/Cars/manage-post/${id}`, approve, {
      headers: { "Content-Type": "application/json" },
    }),

  getPendingLicenses: () => api.get("/Admin/pending-licenses"),

  verifyLicense: (id: number, approve: boolean) =>
    api.post(`/Admin/verify-license/${id}`, approve, {
      headers: { "Content-Type": "application/json" },
    }),

  // GET /api/Admin/permissions (should return array of {id, isSuspended, canAddCars, canRentCars})
  getAllUserPermissions: () => api.get("/Admin/permissions"),

  // PATCH /api/Admin/permissions/{id}
  updateUserPermissions: (
    id: number,
    data: { isSuspended: boolean; canAddCars: boolean; canRentCars: boolean },
  ) => api.patch(`/Admin/permissions/${id}`, data),
};
