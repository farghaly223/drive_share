using cars_rental.DTOs;

namespace cars_rental.Service
{
    public interface IAdminService
    {
        Task<List<AdminDTOs>> GetPendingOwnersAsync();
        Task<List<AdminDTOs>> GetPendingLicensesAsync();
        Task<List<CarListingDTO>> GetPendingCarsAsync();
        Task<(bool Success, string Message)> ManageOwnerAsync(int id, bool approve);
        Task<(bool Success, string Message)> VerifyLicenseAsync(int id, bool approve);

        // ✅ Granular permission control — replaces old SuspendUserAsync
        Task<(bool Success, string Message)> UpdateUserPermissionsAsync(int id, UpdatePermissionsDto dto);
    }
}