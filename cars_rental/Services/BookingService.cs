using cars_rental.DTOs;
using cars_rental.Models;
using cars_rental.Repository;

namespace cars_rental.Service
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _repository;
        public BookingService(IBookingRepository repository) => _repository = repository;

       public async Task<(bool Success, string Message)> CreateRentalRequestAsync(int userId, BookingDto request)
{
    var user = await _repository.GetUserByIdAsync(userId);

    if (user == null)
        return (false, "User not found");

    // ✅ check إنه رافع الرخصة أصلا

    // ✅ check إنها approved
    if (user.IsLicenseVerified != true)
        return (false, "Your license is still under review.");

    var car = await _repository.GetCarByIdAsync(request.CarId);
    if (car == null || car.PostStatus != "approved")
        return (false, "Car is not available for rental.");

    var days = request.EndDate.DayNumber - request.StartDate.DayNumber;
    if (days <= 0)
        return (false, "End date must be after start date.");
    decimal totalPrice = days * (car.RentalPrice ?? 0);

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
            return (true, $"Booking has been {booking.Status}", 200);
        }

        public async Task<(bool Success, string Message)> CompleteBookingAsync(int bookingId)
        {
            var booking = await _repository.GetBookingWithCarAsync(bookingId);
            if (booking == null) return (false, "Booking not found.");

            booking.Status = "completed";
            booking.Car.RentalStatus = "available";

            await _repository.SaveChangesAsync();
            return (true, "Rental completed. Renter can now leave feedback.");
        }
        
    }
}
