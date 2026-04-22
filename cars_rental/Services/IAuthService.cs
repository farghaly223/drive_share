using cars_rental.DTOs;

namespace cars_rental.Service
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(UserRegisterDto dto);
        Task<AuthResponseDto> LoginAsync(UserLoginDto dto);
        bool VerifyPassword(string password, string hash);
        int? GetUserIdFromToken(string token);

       
        Task<bool> UploadLicenseAsync(int userId, string licenseUrl);
    }
}