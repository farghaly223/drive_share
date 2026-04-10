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
                return new AuthResponseDto { Success = true, Message = "تم التسجيل بنجاح", Token = GenerateJwtToken(registeredUser), User = MapUserToDto(registeredUser), ExpiresIn = 3600 };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Registration error: {ex.Message}");
                return new AuthResponseDto { Success = false, Message = "حدث خطأ أثناء التسجيل" };
            }
        }

        public async Task<AuthResponseDto> LoginAsync(UserLoginDto dto)
        {
            try
            {
                var user = await _authRepository.GetUserByEmailAsync(dto.Email);
                if (user == null || !VerifyPassword(dto.Password, user.Password))
                    return new AuthResponseDto { Success = false, Message = "بيانات الدخول غير صحيحة" };

                if (user.AccountStatus != "approved")
                    return new AuthResponseDto { Success = false, Message = $"حسابك غير مفعل حالياً (الحالة: {user.AccountStatus})" };

                // 🔥 CRITICAL: Normalize role to lowercase in case database has mixed case
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

            // 🔥 CRITICAL: Ensure role is ALWAYS lowercase (normalize database value if it has mixed case)
            var roleValue = (user.Role ?? "renter").ToLower().Trim();
            var nameValue = user.Name ?? string.Empty;
            var emailValue = user.Email ?? string.Empty;
            var idValue = user.Id.ToString();

            var claims = new List<Claim>
            {
                // Standard claim types (MUST be lowercase for [Authorize(Roles = "...")] to work)
                new Claim(ClaimTypes.NameIdentifier, idValue),
                new Claim(ClaimTypes.Name, nameValue),
                new Claim(ClaimTypes.Email, emailValue),
                new Claim(ClaimTypes.Role, roleValue), // ✅ MUST be lowercase

                // Custom-friendly claim names (for backward compatibility with existing code)
                new Claim("uid", idValue),
                new Claim("name", nameValue),
                new Claim("email", emailValue),
                new Claim("role", roleValue), // ✅ MUST be lowercase

                // Additional metadata
                new Claim("status", user.AccountStatus ?? "pending")
            };

            _logger.LogInformation($"🔐 Generated JWT token for user {user.Id} with role: '{roleValue}' (original: '{user.Role}')");

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(_configuration["Jwt:ExpirationMinutes"] ?? "60")),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private UserInfoDto MapUserToDto(User user) => new UserInfoDto { Id = user.Id, Name = user.Name, Email = user.Email, Role = user.Role, AccountStatus = user.AccountStatus, IsLicenseVerified = user.IsLicenseVerified };

        public int? GetUserIdFromToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!);
                tokenHandler.ValidateToken(token, new TokenValidationParameters { ValidateIssuerSigningKey = true, IssuerSigningKey = new SymmetricSecurityKey(key), ValidateIssuer = false, ValidateAudience = false }, out SecurityToken validatedToken);
                var jwtToken = (JwtSecurityToken)validatedToken;

                // Try standard name identifier first, then fallback to custom 'uid'
                var idClaim = jwtToken.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier) ?? jwtToken.Claims.FirstOrDefault(x => x.Type == "uid");
                if (idClaim == null) return null;

                if (int.TryParse(idClaim.Value, out var id)) return id;
                return null;
            }
            catch { return null; }
        }
    }
}