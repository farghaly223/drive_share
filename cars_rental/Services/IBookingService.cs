using cars_rental.DTOs;

namespace cars_rental.Service
{
    public interface IBookingService
    {
        Task<(bool Success, string Message)> CreateRentalRequestAsync(int userId, BookingDto request);
        Task<(bool Success, string Message, int StatusCode)> RespondToBookingAsync(int ownerId, int bookingId, bool accept);
        Task<(bool Success, string Message)> CompleteBookingAsync(int bookingId);
        Task<IEnumerable<BookingResponseDto>> GetRenterBookingsAsync(int userId);
        Task<IEnumerable<BookingResponseDto>> GetOwnerBookingRequestsAsync(int ownerId);
    }
}

