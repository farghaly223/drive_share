using cars_rental.DTOs;

namespace cars_rental.Service
{
    public interface ICarsService
    {
        Task<string> AddCarAsync(int ownerId, CarCreateUpdateDto dto);
        Task<(bool Success, string Message)> ManageCarPostAsync(int id, bool approve);
        Task<(bool Success, string Message, int StatusCode)> DeleteCarAsync(int carId, int currentUserId);
    }
}

