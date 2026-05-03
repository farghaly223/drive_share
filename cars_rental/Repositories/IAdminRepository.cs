using System.Collections.Generic;
using System.Threading.Tasks;
using cars_rental.Models;

namespace cars_rental.Repository
{
    public interface IAdminRepository
    {
        Task<List<User>> GetPendingOwnersAsync();
        Task<List<User>> GetPendingLicensesAsync(); 
        Task<List<Car>> GetPendingCarsAsync(); 
        Task<User?> GetUserByIdAsync(int id);
        Task SaveChangesAsync();
    }
}