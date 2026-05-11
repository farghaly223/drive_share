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
            // 1. Validate User
            var user = await _repository.GetUserByIdAsync(userId);
            if (user == null) return (false, "User not found.");

            if (user.IsSuspended)
                return (false, "Your account has been suspended.");

            if (!user.CanRentCars)
                return (false, "You are not authorized to rent cars.");

            if (user.IsLicenseVerified != true)
                return (false, "Your driver's license is not yet verified.");

            // 2. Validate Car
            var car = await _repository.GetCarByIdAsync(request.CarId);
            if (car == null || car.PostStatus != "approved")
                return (false, "Car is not available for rental.");

            // 3. Validate Dates & Calculate Duration
            if (request.StartDate < DateOnly.FromDateTime(DateTime.Now))
                return (false, "Start date cannot be in the past.");

            var days = request.EndDate.DayNumber - request.StartDate.DayNumber;
            if (days <= 0)
                return (false, "Rental duration must be at least one day.");

            // 4. Check for Overlapping Bookings
            var isOverlap = await _repository.HasOverlappingBookingAsync(request.CarId, request.StartDate, request.EndDate);
            if (isOverlap)
                return (false, "The car is already booked for these dates.");

            // 5. Calculate Price and Create Booking
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

            // 6. Notify Owner
            await _notifications.SendNotificationAsync(
                car.OwnerId,
                $"New rental request for your car \"{car.Title}\" - Total: {totalPrice} EGP"
            );

            return (true, $"Rental request sent successfully. Total price: {totalPrice} EGP");
        }

        public async Task<(bool Success, string Message, int StatusCode)> RespondToBookingAsync(int ownerId, int bookingId, bool accept)
        {
            var booking = await _repository.GetBookingWithCarAsync(bookingId);
            if (booking == null) return (false, "Not Found", 404);
            
            if (booking.Car == null || booking.Car.OwnerId != ownerId) 
                return (false, "Forbidden", 403);

            booking.Status = accept ? "accepted" : "rejected";
            
            // Optional: Update car status if accepted
            if (accept) booking.Car.RentalStatus = "rented";

            await _repository.SaveChangesAsync();

            var statusText = accept ? "accepted" : "rejected";
            await _notifications.SendNotificationAsync(
                booking.RenterId,
                $"Your rental request for \"{booking.Car.Title}\" has been {statusText}"
            );

            return (true, $"Booking has been {statusText}", 200);
        }

        // FIXED: Added missing method name 'CompleteBookingAsync'
        public async Task<(bool Success, string Message)> CompleteBookingAsync(int bookingId)
        {
            var booking = await _repository.GetBookingWithCarAsync(bookingId);
            if (booking == null) return (false, "Booking not found.");

            booking.Status = "completed";
            
            if (booking.Car != null)
            {
                booking.Car.RentalStatus = "available";
            }

            await _repository.SaveChangesAsync();

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
                CarTitle = b.Car?.Title ?? "Unknown Car",
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
                CarTitle = b.Car?.Title ?? "Unknown Car",
                Status = b.Status,
                TotalPrice = b.TotalPrice
            });
        }
    }
}