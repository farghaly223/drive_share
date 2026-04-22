using cars_rental.Models;

namespace cars_rental.Repository
{
    public interface IAdminRepository
    {
        Task<List<User>> GetPendingOwnersAsync();
        Task<List<User>> GetPendingLicensesAsync(); // New
        Task<List<Car>> GetPendingCarsAsync(); // New
        Task<User?> GetUserByIdAsync(int id);
        Task SaveChangesAsync();
    }
}