using cars_rental.Models;
using Microsoft.EntityFrameworkCore;

namespace cars_rental.Repository
{
    public class AdminRepository : IAdminRepository
    {
        private readonly CarRentalDbContext _context;
        public AdminRepository(CarRentalDbContext context) => _context = context;

        public async Task<List<User>> GetPendingOwnersAsync()
        {
            return await _context.Users
                .Where(u => u.AccountStatus != null && u.AccountStatus.ToLower() == "pending")
                .ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(int id) => await _context.Users.FindAsync(id);

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}

