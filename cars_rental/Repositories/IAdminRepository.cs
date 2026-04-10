using cars_rental.Models;

namespace cars_rental.Repository
{
    public interface IAdminRepository
    {
        Task<List<User>> GetPendingOwnersAsync();
        Task<User> GetUserByIdAsync(int id);
        Task SaveChangesAsync();
    }
}

