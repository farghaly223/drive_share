import api from './api';
import type { BookingDto, BookingResponse } from '../types';

export const bookingApi = {
  request: (data: BookingDto) => api.post('/Booking/request', data),
  respond: (id: number, accept: boolean) =>
    api.patch(`/Booking/${id}/respond`, accept, {
      headers: { 'Content-Type': 'application/json' },
    }),
  complete: (id: number) => api.patch(`/Booking/${id}/complete`),
  getMyBookings: () => api.get('/Booking/my'),
  getOwnerRequests: () => api.get('/Booking/owner-requests'),
};