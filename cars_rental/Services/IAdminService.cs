using cars_rental.DTOs;

namespace cars_rental.Service
{
    public interface IAdminService
    {
        Task<List<AdminDTOs>> GetPendingOwnersAsync();
        Task<(bool Success, string Message)> ManageOwnerAsync(int id, bool approve);
    }
}

