using cars_rental.DTOs;

namespace cars_rental.Service
{
    /// <summary>
    /// واجهة خدمة المصادقة والتفويض
    /// Interface for Authentication and Authorization Service
    /// </summary>
    public interface IAuthService
    {
        /// <summary>
        /// تسجيل مستخدم جديد / Register a New User
        /// </summary>
        Task<AuthResponseDto> RegisterAsync(UserRegisterDto dto);

        /// <summary>
        /// تسجيل دخول المستخدم / Login User
        /// </summary>
        Task<AuthResponseDto> LoginAsync(UserLoginDto dto);

        /// <summary>
        /// التحقق من صحة كلمة المرور / Verify Password
        /// </summary>
        bool VerifyPassword(string password, string hash);

        /// <summary>
        /// الحصول على معلومات المستخدم من Token / Get User from Token
        /// </summary>
        int? GetUserIdFromToken(string token);
    }
}
