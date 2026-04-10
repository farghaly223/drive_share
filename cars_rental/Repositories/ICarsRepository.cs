using cars_rental.Models;

namespace cars_rental.Repository
{
    public interface ICarsRepository
    {
        Task<Car> GetByIdAsync(int id);
        Task<Car> GetByIdWithBookingsAsync(int id);
        Task AddAsync(Car car);
        void Delete(Car car);
        Task SaveChangesAsync();
    }
}

