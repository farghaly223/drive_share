import axios from 'axios';

const API_BASE_URL = 'http://localhost:5130/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Auth ──────────────────────────────────────────────
// POST /api/auth/register   body: { name, email, password, confirmPassword, role }
// POST /api/auth/login      body: { email, password }
// Response: { success, message, token, user: { id, name, email, role, accountStatus, isLicenseVerified }, expiresIn }
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login',    data),
};

// ── Browsing (public) ─────────────────────────────────
// GET /api/browsing/all
// GET /api/browsing/filter?search=&maxPrice=&location=&carType=
// GET /api/browsing/{id}
// Response: CarListingDTO[] or CarListingDTO
//   { id, ownerName, title, description, carType, brand, model, year,
//     transmission, location, rentalPrice, rentalStatus, mainImageUrl }
export const carsAPI = {
  getAllCars:  ()        => api.get('/browsing/all'),
  filterCars: (params)  => api.get('/browsing/filter', { params }),
  getCarById: (id)      => api.get(`/browsing/${id}`),

  // POST /api/cars  (owner only) — body: CarCreateUpdateDto
  // { title, description, carType, brand, model, year, transmission, location, rentalPrice, availabilityCalendar }
  addCar:     (data)    => api.post('/cars', data),

  // DELETE /api/cars/{id}  (owner only)
  deleteCar:  (id)      => api.delete(`/cars/${id}`),
};

// ── Booking ───────────────────────────────────────────
// POST   /api/booking/request         body: { carId, startDate, endDate }  (renter only)
// PATCH  /api/booking/{id}/respond    body: true|false                     (owner only)
// PATCH  /api/booking/{id}/complete                                         (owner only)
export const bookingAPI = {
  requestRental:    (data)              => api.post('/booking/request', data),
  respondToBooking: (bookingId, accept) => api.patch(`/booking/${bookingId}/respond`, accept),
  completeBooking:  (bookingId)         => api.patch(`/booking/${bookingId}/complete`),
  // NOTE: The backend does not yet expose a GET bookings endpoint.
  // getMyBookings is defined here so MyBookings.jsx can call it;
  // it will return 404 until the backend adds it. The component handles this gracefully.
  getMyBookings: () => api.get('/booking/my'),
};

// ── Admin ─────────────────────────────────────────────
// GET  /api/admin/pending-owners          → AdminDTOs[]  { id, name, email, createdAt }
// POST /api/admin/manage-owner/{id}       body: true|false
// PATCH /api/cars/manage-post/{id}        body: true|false   (admin only, lives on CarsController)
export const adminAPI = {
  getPendingOwners: ()          => api.get('/admin/pending-owners'),
  manageOwner:      (id, ok)    => api.post(`/admin/manage-owner/${id}`, ok),

  // Car post moderation is on CarsController, not AdminController
  getPendingCars:   ()          => api.get('/admin/pending-cars'),   // if backend adds it
  manageCar:        (id, ok)    => api.patch(`/cars/manage-post/${id}`, ok),
};

export default api;
