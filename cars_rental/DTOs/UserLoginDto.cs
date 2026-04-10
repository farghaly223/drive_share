namespace cars_rental.DTOs;

/// <summary>
/// DTO لعملية تسجيل الدخول / Data Transfer Object for User Login
/// </summary>
public class UserLoginDto
{
    /// <summary>
    /// البريد الإلكتروني / Email Address
    /// </summary>
    public string Email { get; set; } = null!;

    /// <summary>
    /// كلمة المرور / Password
    /// </summary>
    public string Password { get; set; } = null!;
}
