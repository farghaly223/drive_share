using System.Collections.Generic;
using System.Threading.Tasks;
using cars_rental.Models;

namespace cars_rental.Interfaces
{
    public interface IBrowsingRepository
    {
        Task<IEnumerable<Car>> GetApprovedCarsAsync();
        Task<Car?> GetCarByIdAsync(int id);
    }
}