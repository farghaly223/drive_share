using cars_rental.Models;
using Microsoft.EntityFrameworkCore;

namespace cars_rental.Repository
{
    public class BookingRepository : IBookingRepository
    {
        private readonly CarRentalDbContext _context;
        public BookingRepository(CarRentalDbContext context) => _context = context;

        public async Task<User> GetUserByIdAsync(int id) => await _context.Users.FindAsync(id);
        public async Task<Car> GetCarByIdAsync(int id) => await _context.Cars.FindAsync(id);
        public async Task<Booking> GetBookingWithCarAsync(int id) =>
            await _context.Bookings.Include(b => b.Car).FirstOrDefaultAsync(b => b.Id == id);
        public async Task AddBookingAsync(Booking booking) => await _context.Bookings.AddAsync(booking);
        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
        public async Task<IEnumerable<Booking>> GetBookingsByRenterIdAsync(int renterId)
        {
            return await _context.Bookings
                .Include(b => b.Car)
                .Where(b => b.RenterId == renterId)
                .ToListAsync();
        }
        public async Task<IEnumerable<Booking>> GetBookingsByOwnerIdAsync(int ownerId)
        {
            return await _context.Bookings
                .Include(b => b.Car)
                .Where(b => b.Car.OwnerId == ownerId)
                .ToListAsync();
        }

    }
}