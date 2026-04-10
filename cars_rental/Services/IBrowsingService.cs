using System.Collections.Generic;
using System.Threading.Tasks;
using cars_rental.DTOs;

namespace cars_rental.Interfaces
{
    public interface IBrowsingService
    {
        Task<IEnumerable<CarListingDTO>> GetAllCarsAsync();
        Task<IEnumerable<CarListingDTO>> FilterCarsAsync(string? search, decimal? maxPrice, string? location, string? carType);
        Task<CarListingDTO?> GetCarDetailsAsync(int id);
    }
}