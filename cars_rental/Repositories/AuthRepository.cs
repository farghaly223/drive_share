using cars_rental.Models;
using Microsoft.EntityFrameworkCore;

namespace cars_rental.Repository
{
    /// <summary>
    /// مستودع المصادقة - يتعامل مع عمليات قاعدة البيانات المتعلقة بالمستخدمين
    /// Authentication Repository - Handles database operations for Users
    /// </summary>
    public class AuthRepository : IAuthRepository
    {
        private readonly CarRentalDbContext _context;

        /// <summary>
        /// مُنشئ المستودع / Repository Constructor
        /// </summary>
        public AuthRepository(CarRentalDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// الحصول على مستخدم من خلال البريد الإلكتروني
        /// Get a user by email address from the database
        /// </summary>
        public async Task<User?> GetUserByEmailAsync(string email)
        {
            // البحث عن مستخدم بناءً على البريد الإلكتروني (غير حساس لحالة الأحرف)
            // Search for a user based on email (case-insensitive)
            return await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        /// <summary>
        /// تسجيل مستخدم جديد في قاعدة البيانات
        /// Register a new user in the database
        /// </summary>
        public async Task<User> RegisterUserAsync(User user)
        {
            // إضافة المستخدم الجديد إلى قاعدة البيانات
            // Add new user to the database
            await _context.Users.AddAsync(user);
            await SaveChangesAsync();
            return user;
        }

        /// <summary>
        /// الحصول على مستخدم من خلال المعرف
        /// Get a user by their ID
        /// </summary>
        public async Task<User?> GetUserByIdAsync(int userId)
        {
            // البحث عن مستخدم بناءً على معرفه الفريد
            // Search for a user based on their unique ID
            return await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == userId);
        }

        /// <summary>
        /// التحقق من وجود البريد الإلكتروني في قاعدة البيانات
        /// Check if an email already exists in the database
        /// </summary>
        public async Task<bool> EmailExistsAsync(string email)
        {
            // التحقق من وجود البريد الإلكتروني (غير حساس لحالة الأحرف)
            // Check if email exists (case-insensitive)
            return await _context.Users
                .AnyAsync(u => u.Email.ToLower() == email.ToLower());
        }

        /// <summary>
        /// حفظ التغييرات في قاعدة البيانات
        /// Save changes to the database
        /// </summary>
        public async Task SaveChangesAsync()
        {
            // حفظ جميع التغييرات المعلقة إلى قاعدة البيانات
            // Save all pending changes to database
            await _context.SaveChangesAsync();
        }
    }
}
