using cars_rental.Models;

namespace cars_rental.Repository
{
    public interface ICarsRepository
    {
        Task<Car> GetByIdAsync(int id);
        Task<Car> GetByIdWithBookingsAsync(int id);
        Task AddAsync(Car car);
        void Delete(Car car);
        Task<IEnumerable<Car>> GetCarsByOwnerIdAsync(int ownerId);
        Task<Car> GetCarByIdAsync(int carId);
        Task UpdateCarAsync(Car car);
        Task<User?> GetUserByIdAsync(int id);
        Task SaveChangesAsync();
    }
}

