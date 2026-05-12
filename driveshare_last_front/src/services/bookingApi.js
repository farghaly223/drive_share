import api from './api';

export const bookingApi = {
  request: (data) => api.post('/Booking/request', data),

  respond: (id, accept) =>
    api.patch(`/Booking/${id}/respond`, accept, {
      headers: { 'Content-Type': 'application/json' },
    }),

  complete: (id) => api.patch(`/Booking/${id}/complete`),
  getMyBookings: () => api.get('/Booking/my'),
  getOwnerRequests: () => api.get('/Booking/owner-requests'),
};
