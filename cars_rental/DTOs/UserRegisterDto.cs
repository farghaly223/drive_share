namespace cars_rental.DTOs;

/// <summary>
/// DTO لتسجيل مستخدم جديد / Data Transfer Object for User Registration
/// </summary>
public class UserRegisterDto
{
    /// <summary>
    /// اسم المستخدم / User Full Name
    /// </summary>
    public string Name { get; set; } = null!;

    /// <summary>
    /// البريد الإلكتروني / Email Address
    /// </summary>
    public string Email { get; set; } = null!;

    /// <summary>
    /// كلمة المرور (سيتم تشفيرها بـ BCrypt) / Password (will be hashed with BCrypt)
    /// </summary>
    public string Password { get; set; } = null!;

    /// <summary>
    /// تأكيد كلمة المرور / Password Confirmation
    /// </summary>
    public string ConfirmPassword { get; set; } = null!;

    /// <summary>
    /// الدور (Admin, Owner, Renter) / Role (Admin, Owner, Renter)
    /// </summary>
    public string Role { get; set; } = "Renter";
}
