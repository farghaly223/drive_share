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


    }
}
