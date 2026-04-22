using cars_rental.Models;

namespace cars_rental.Repository
{
    public interface IAuthRepository
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task<User> RegisterUserAsync(User user);
        Task<User?> GetUserByIdAsync(int userId);
        Task<bool> EmailExistsAsync(string email);
        Task SaveChangesAsync();

        // --- التعديل الجديد ---
        /// <summary>
        /// تحديث بيانات المستخدم (مثل رابط الرخصة وحالة التحقق)
        /// Update user data (like license URL and verification status)
        /// </summary>
        Task UpdateUserAsync(User user);
    }
}