using cars_rental.Models;
using cars_rental.Repository;
using Microsoft.EntityFrameworkCore;
public class AuthRepository : IAuthRepository
{
    private readonly CarRentalDbContext _context;

    public AuthRepository(CarRentalDbContext context) => _context = context;

    // الميثود القديمة كما هي
    public async Task<User?> GetUserByEmailAsync(string email) =>
        await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

    public async Task<User> RegisterUserAsync(User user)
    {
        await _context.Users.AddAsync(user);
        await SaveChangesAsync();
        return user;
    }

    // تعديل بسيط: شلنا AsNoTracking عشان نقدر نحدث البيانات بعدها في الـ Service
    public async Task<User?> GetUserByIdAsync(int userId)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
    }

    public async Task<bool> EmailExistsAsync(string email) =>
        await _context.Users.AnyAsync(u => u.Email.ToLower() == email.ToLower());

    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();

    // --- التعديل الجديد ---
    /// <summary>
    /// تحديث بيانات المستخدم في قاعدة البيانات
    /// </summary>
    public async Task UpdateUserAsync(User user)
    {
        _context.Users.Update(user);
        await SaveChangesAsync();
    }
}