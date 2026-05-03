using cars_rental.DTOs;
using cars_rental.Models;

namespace cars_rental.Service
{
    public interface ICarsService
    {
        Task<string> AddCarAsync(int ownerId, CarCreateUpdateDto dto);
        Task<(bool Success, string Message)> ManageCarPostAsync(int id, bool approve);
        Task<(bool Success, string Message, int StatusCode)> DeleteCarAsync(int carId, int currentUserId);
        Task<IEnumerable<Car>> GetCarsByOwnerIdAsync(int ownerId);
        Task<(bool Success, string Message)> UpdateCarAsync(int ownerId, int carId, CarCreateUpdateDto dto);
    }
}