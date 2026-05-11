using cars_rental.Models;

namespace cars_rental.Repository
{
    public interface IBookingRepository
    {
            Task<User> GetUserByIdAsync(int id);
            Task<Car> GetCarByIdAsync(int id);
            Task<Booking> GetBookingWithCarAsync(int id);
            Task AddBookingAsync(Booking booking);
            Task SaveChangesAsync();
            Task<IEnumerable<Booking>> GetBookingsByRenterIdAsync(int renterId);
            Task<IEnumerable<Booking>> GetBookingsByOwnerIdAsync(int ownerId);
            Task<bool> HasOverlappingBookingAsync(int carId, DateOnly start, DateOnly end);
    }
}
