using cars_rental.Models;

namespace cars_rental.Repository
{
    /// <summary>
    /// واجهة لعمليات مستودع المصادقة / Interface for Authentication Repository
    /// </summary>
    public interface IAuthRepository
    {
        /// <summary>
        /// الحصول على مستخدم من خلال البريد الإلكتروني / Get User by Email
        /// </summary>
        Task<User?> GetUserByEmailAsync(string email);

        /// <summary>
        /// تسجيل مستخدم جديد / Register New User
        /// </summary>
        Task<User> RegisterUserAsync(User user);

        /// <summary>
        /// الحصول على مستخدم من خلال المعرف / Get User by ID
        /// </summary>
        Task<User?> GetUserByIdAsync(int userId);

        /// <summary>
        /// التحقق من وجود البريد الإلكتروني / Check if Email Exists
        /// </summary>
        Task<bool> EmailExistsAsync(string email);

        /// <summary>
        /// حفظ التغييرات في قاعدة البيانات / Save Changes to Database
        /// </summary>
        Task SaveChangesAsync();
    }
}
