namespace cars_rental.DTOs;

/// <summary>
/// DTO لاستجابة المصادقة / Data Transfer Object for Authentication Response
/// </summary>
public class AuthResponseDto
{
    /// <summary>
    /// هل العملية نجحت / Success Status
    /// </summary>
    public bool Success { get; set; }

    /// <summary>
    /// الرسالة / Response Message
    /// </summary>
    public string Message { get; set; } = null!;

    /// <summary>
    /// JWT Token (إن وُجد) / JWT Token (if available)
    /// </summary>
    public string? Token { get; set; }

    /// <summary>
    /// بيانات المستخدم / User Data
    /// </summary>
    public UserInfoDto? User { get; set; }

    /// <summary>
    /// وقت انتهاء الـ Token بالثواني / Token Expiration Time in Seconds
    /// </summary>
    public int? ExpiresIn { get; set; }
}

/// <summary>
/// DTO يحتوي على معلومات المستخدم الأساسية / User Information DTO
/// </summary>
public class UserInfoDto
{
    /// <summary>
    /// معرف المستخدم / User ID
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// اسم المستخدم / User Name
    /// </summary>
    public string Name { get; set; } = null!;

    /// <summary>
    /// البريد الإلكتروني / Email Address
    /// </summary>
    public string Email { get; set; } = null!;

    /// <summary>
    /// الدور / Role
    /// </summary>
    public string Role { get; set; } = null!;

    /// <summary>
    /// حالة الحساب / Account Status
    /// </summary>
    public string? AccountStatus { get; set; }

    /// <summary>
    /// هل تم التحقق من رخصة القيادة / License Verification Status
    /// </summary>
    public bool? IsLicenseVerified { get; set; }
}
