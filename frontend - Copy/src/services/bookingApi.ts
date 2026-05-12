import api from './api';
import type { BookingDto, BookingResponse, MyBookingDTO, OwnerBookingRequestDTO } from '../types';

export const bookingApi = {
  request: (data: BookingDto) => api.post('/Booking/request', data),
  
  respond: (id: number, accept: boolean) =>
    api.patch(`/Booking/${id}/respond`, accept, {
      headers: { 'Content-Type': 'application/json' },
    }),
    
  complete: (id: number) => api.patch(`/Booking/${id}/complete`),
  
  getMyBookings: () => api.get<MyBookingDTO[]>('/Booking/my'),
  
  getOwnerRequests: () => api.get<OwnerBookingRequestDTO[]>('/Booking/owner-requests'),
};