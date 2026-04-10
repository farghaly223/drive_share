using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using cars_rental.Models;
using cars_rental.Interfaces;

namespace cars_rental.Repositories
{
    public class BrowsingRepository : IBrowsingRepository
    {
        private readonly CarRentalDbContext _context;
        public BrowsingRepository(CarRentalDbContext context) => _context = context;

        public async Task<IEnumerable<Car>> GetApprovedCarsAsync()
        {
            return await _context.Cars
                .Include(c => c.Owner)
                .Include(c => c.CarImages)
                .Where(c => c.PostStatus == "approved")
                .ToListAsync();
        }

        public async Task<Car?> GetCarByIdAsync(int id)
        {
            return await _context.Cars
                .Include(c => c.Owner)
                .Include(c => c.CarImages)
                .FirstOrDefaultAsync(c => c.Id == id);
        }
    }
}