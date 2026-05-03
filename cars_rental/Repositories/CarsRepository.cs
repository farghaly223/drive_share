using cars_rental.Models;
using Microsoft.EntityFrameworkCore;

namespace cars_rental.Repository
{
    public class CarsRepository : ICarsRepository
    {
        private readonly CarRentalDbContext _context;
        public CarsRepository(CarRentalDbContext context) => _context = context;

        public async Task<Car> GetByIdAsync(int id) => await _context.Cars.FindAsync(id);

        public async Task<Car> GetByIdWithBookingsAsync(int id) =>
            await _context.Cars.Include(c => c.Bookings).FirstOrDefaultAsync(c => c.Id == id);

        public async Task AddAsync(Car car) => await _context.Cars.AddAsync(car);

        public void Delete(Car car) => _context.Cars.Remove(car);

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
        public async Task<IEnumerable<Car>> GetCarsByOwnerIdAsync(int ownerId)
        {
            return await _context.Cars.Where(c => c.OwnerId == ownerId).ToListAsync();
        }

        public async Task<Car> GetCarByIdAsync(int id) => await _context.Cars.FindAsync(id);

        public async Task UpdateCarAsync(Car car)
        {
            _context.Cars.Update(car);
            await _context.SaveChangesAsync();
        }
        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }
    }


}

