using cars_rental.DTOs;

namespace cars_rental.Service
{
    public interface IAdminService
    {
        // 1. Existing functionality for Owners
        Task<List<AdminDTOs>> GetPendingOwnersAsync();
        Task<(bool Success, string Message)> ManageOwnerAsync(int id, bool approve);

        // 2. New functionality for Driver Licenses
        Task<List<AdminDTOs>> GetPendingLicensesAsync();
        Task<(bool Success, string Message)> VerifyLicenseAsync(int id, bool approve);

        // 3. New functionality for Pending Cars
        Task<List<CarListingDTO>> GetPendingCarsAsync();
    }
}