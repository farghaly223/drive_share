using cars_rental.DTOs;
using cars_rental.Repository;

namespace cars_rental.Service
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _repository;
        public AdminService(IAdminRepository repository) => _repository = repository;

        public async Task<List<AdminDTOs>> GetPendingOwnersAsync()
        {
            var users = await _repository.GetPendingOwnersAsync();
            return users.Select(u => new AdminDTOs
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                CreatedAt = u.CreatedAt ?? DateTime.Now
            }).ToList();
        }

        public async Task<List<AdminDTOs>> GetPendingLicensesAsync()
        {
            var users = await _repository.GetPendingLicensesAsync();
            return users.Select(u => new AdminDTOs
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                DriverLicenseUrl = u.DriverLicenseUrl,
                CreatedAt = u.CreatedAt ?? DateTime.Now
            }).ToList();
        }

        public async Task<List<CarListingDTO>> GetPendingCarsAsync()
        {
            var cars = await _repository.GetPendingCarsAsync();
            return cars.Select(c => new CarListingDTO
            {
                Id = c.Id,
                Title = c.Title,
                Brand = c.Brand,
                RentalPrice = c.RentalPrice,
                PostStatus = c.PostStatus
            }).ToList();
        }

        public async Task<(bool Success, string Message)> ManageOwnerAsync(int id, bool approve)
        {
            var owner = await _repository.GetUserByIdAsync(id);
            if (owner == null) return (false, "Account not found");

            owner.AccountStatus = approve ? "approved" : "rejected";
            owner.IsLicenseVerified = approve;

            await _repository.SaveChangesAsync();
            return (true, approve ? "Owner Verified" : "Owner Rejected");
        }

        public async Task<(bool Success, string Message)> VerifyLicenseAsync(int id, bool approve)
        {
            var user = await _repository.GetUserByIdAsync(id);
            if (user == null) return (false, "User not found");

            user.IsLicenseVerified = approve;
            if (approve) user.AccountStatus = "approved";

            await _repository.SaveChangesAsync();
            return (true, approve ? "License Approved" : "License Rejected");
        }
    }
}