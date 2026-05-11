using cars_rental.DTOs;
using cars_rental.Models;
using cars_rental.Repository;
using cars_rental.Services;

namespace cars_rental.Service
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _repository;
        private readonly INotificationService _notifications;

        public BookingService(IBookingRepository repository, INotificationService notifications)
        {
            _repository = repository;
            _notifications = notifications;
        }

        public async Task<(bool Success, string Message)> CreateRentalRequestAsync(int userId, BookingDto request)
        {
            var user = await _repository.GetUserByIdAsync(userId);
            if (user == null) return (false, "User not found");

            if (user.IsSuspended)
                return (false, "Your account has been suspended. Contact admin for support.");

            if (!user.CanRentCars)
                return (false, "You are not allowed to make rental requests. Contact admin for support.");

            if (user.IsLicenseVerified != true)
                return (false, "Your license is still under review.");

            var car = await _repository.GetCarByIdAsync(request.CarId);
            if (car == null || car.PostStatus != "approved")
                return (false, "Car is not available for rental.");

            var days = request.EndDate.DayNumber - request.StartDate.DayNumber;
            if (days <= 0)
                return (false, "End date must be after start date.");

            decimal totalPrice = (decimal)days * (car.RentalPrice ?? 0m);

            var booking = new Booking
            {
                CarId = request.CarId,
                RenterId = userId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                TotalPrice = totalPrice,
                Status = "pending",
                CreatedAt = DateTime.Now
            };

            await _repository.AddBookingAsync(booking);
            await _repository.SaveChangesAsync();

            // Notify the car owner about the new rental request
            await _notifications.SendNotificationAsync(
                car.OwnerId,
                $"New rental request for your car \"{car.Title}\" - Total: {totalPrice} EGP"
            );

            return (true, $"Rental request sent successfully. Total price: {totalPrice}");
        }

        public async Task<(bool Success, string Message, int StatusCode)> RespondToBookingAsync(int ownerId, int bookingId, bool accept)
        {
            var booking = await _repository.GetBookingWithCarAsync(bookingId);
            if (booking == null) return (false, "Not Found", 404);
            if (booking.Car.OwnerId != ownerId) return (false, "Forbidden", 403);

            booking.Status = accept ? "accepted" : "rejected";
            if (accept) booking.Car.RentalStatus = "rented";

            await _repository.SaveChangesAsync();

            // Notify the renter of the owner's decision
            var statusText = accept ? "accepted" : "rejected";
            await _notifications.SendNotificationAsync(
                booking.RenterId,
                $"Your rental request for \"{booking.Car.Title}\" has been {statusText}"
            );

            return (true, $"Booking has been {booking.Status}", 200);
        }

        public async Task<(bool Success, string Message)> CompleteBookingAsync(int bookingId)
        {
            var booking = await _repository.GetBookingWithCarAsync(bookingId);
            if (booking == null) return (false, "Booking not found.");

            booking.Status = "completed";
            booking.Car.RentalStatus = "available";

            await _repository.SaveChangesAsync();

            // Notify the renter that the rental is complete
            await _notifications.SendNotificationAsync(
                booking.RenterId,
                $"Your rental of \"{booking.Car.Title}\" is now complete. You can leave a review!"
            );

            return (true, "Rental completed. Renter can now leave feedback.");
        }

        public async Task<IEnumerable<BookingResponseDto>> GetRenterBookingsAsync(int userId)
        {
            var bookings = await _repository.GetBookingsByRenterIdAsync(userId);
            return bookings.Select(b => new BookingResponseDto
            {
                Id = b.Id,
                CarTitle = b.Car.Title,
                Status = b.Status,
                TotalPrice = b.TotalPrice
            });
        }

        public async Task<IEnumerable<BookingResponseDto>> GetOwnerBookingRequestsAsync(int ownerId)
        {
            var bookings = await _repository.GetBookingsByOwnerIdAsync(ownerId);
            return bookings.Select(b => new BookingResponseDto
            {
                Id = b.Id,
                CarTitle = b.Car.Title,
                Status = b.Status,
                TotalPrice = b.TotalPrice
            });
        }
    }
}
