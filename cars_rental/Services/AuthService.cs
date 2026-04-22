using cars_rental.DTOs;
using cars_rental.Models;
using cars_rental.Repository;
using cars_rental.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace cars_rental.Service
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(IAuthRepository authRepository, IConfiguration configuration, ILogger<AuthService> logger)
        {
            _authRepository = authRepository;
            _configuration = configuration;
            _logger = logger;
        }

        // --- ميثود رفع الرخصة (الجديدة) ---
        public async Task<bool> UploadLicenseAsync(int userId, string licenseUrl)
        {
            try
            {
                var user = await _authRepository.GetUserByIdAsync(userId);
                if (user == null) return false;

                user.DriverLicenseUrl = licenseUrl;
                user.IsLicenseVerified = false; // بانتظار مراجعة الأدمن

                // إعادة تفعيل الطلب لو كان مرفوضاً سابقاً
                if (user.AccountStatus == "rejected")
                    user.AccountStatus = "pending";

                await _authRepository.UpdateUserAsync(user);
                _logger.LogInformation($"📄 License URL updated for User ID: {userId}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error uploading license: {ex.Message}");
                return false;
            }
        }

        // --- ميثود التسجيل ---
        public async Task<AuthResponseDto> RegisterAsync(UserRegisterDto dto)
        {
            try
            {
                if (dto.Password != dto.ConfirmPassword)
                    return new AuthResponseDto { Success = false, Message = "كلمات المرور غير متطابقة" };

                if (await _authRepository.EmailExistsAsync(dto.Email))
                    return new AuthResponseDto { Success = false, Message = "البريد الإلكتروني موجود بالفعل" };

                var user = new User
                {
                    Name = dto.Name,
                    Email = dto.Email.ToLower(),
                    Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    Role = dto.Role.ToLower(),
                    AccountStatus = dto.Role.ToLower() == "admin" ? "approved" : "pending",
                    CreatedAt = DateTime.UtcNow,
                    IsLicenseVerified = dto.Role.ToLower() == "admin"
                };

                var registeredUser = await _authRepository.RegisterUserAsync(user);
                return new AuthResponseDto
                {
                    Success = true,
                    Message = "تم التسجيل بنجاح",
                    Token = GenerateJwtToken(registeredUser),
                    User = MapUserToDto(registeredUser),
                    ExpiresIn = 3600
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Registration error: {ex.Message}");
                return new AuthResponseDto { Success = false, Message = "حدث خطأ أثناء التسجيل" };
            }
        }

        // --- ميثود تسجيل الدخول ---
        public async Task<AuthResponseDto> LoginAsync(UserLoginDto dto)
        {
            try
            {
                var user = await _authRepository.GetUserByEmailAsync(dto.Email);
                if (user == null || !VerifyPassword(dto.Password, user.Password))
                    return new AuthResponseDto { Success = false, Message = "بيانات الدخول غير صحيحة" };

                if (user.AccountStatus != "approved")
                    return new AuthResponseDto { Success = false, Message = $"حسابك غير مفعل حالياً (الحالة: {user.AccountStatus})" };

                user.Role = (user.Role ?? "renter").ToLower().Trim();

                var token = GenerateJwtToken(user);
                _logger.LogInformation($"✅ Login successful for {user.Email} with role: {user.Role}");
                return new AuthResponseDto { Success = true, Message = "تم تسجيل الدخول بنجاح", Token = token, User = MapUserToDto(user), ExpiresIn = 3600 };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Login error: {ex.Message}");
                return new AuthResponseDto { Success = false, Message = "حدث خطأ أثناء تسجيل الدخول" };
            }
        }

        public bool VerifyPassword(string password, string hash)
        {
            try { return BCrypt.Net.BCrypt.Verify(password, hash); }
            catch { return false; }
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var roleValue = (user.Role ?? "renter").ToLower().Trim();
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name ?? ""),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
                new Claim(ClaimTypes.Role, roleValue),
                new Claim("uid", user.Id.ToString()),
                new Claim("role", roleValue),
                new Claim("status", user.AccountStatus ?? "pending")
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(_configuration["Jwt:ExpirationMinutes"] ?? "60")),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private UserInfoDto MapUserToDto(User user) => new UserInfoDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            AccountStatus = user.AccountStatus,
            IsLicenseVerified = user.IsLicenseVerified
        };

        public int? GetUserIdFromToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!);
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var idClaim = jwtToken.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier) ?? jwtToken.Claims.FirstOrDefault(x => x.Type == "uid");

                if (idClaim != null && int.TryParse(idClaim.Value, out var id)) return id;
                return null;
            }
            catch { return null; }
        }
    }
}