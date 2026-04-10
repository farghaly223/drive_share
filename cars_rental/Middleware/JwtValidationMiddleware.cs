using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace cars_rental.Middleware
{
    /// <summary>
    /// ⚠️ DEPRECATED: This middleware is NO LONGER USED in the pipeline.
    /// ASP.NET Core's AddJwtBearer already handles token validation.
    /// This file is kept for reference only.
    /// 
    /// Middleware للتحقق من صحة JWT Token في كل طلب
    /// JWT Token Validation Middleware - Validates JWT tokens on each request
    /// </summary>
    public class JwtValidationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<JwtValidationMiddleware> _logger;

        /// <summary>
        /// مُنشئ Middleware التحقق من Token / JWT Validation Middleware Constructor
        /// </summary>
        public JwtValidationMiddleware(RequestDelegate next, ILogger<JwtValidationMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        /// <summary>
        /// استدعاء Middleware / Middleware invocation method
        /// ⚠️ WARNING: This middleware is deprecated and should NOT be used in the pipeline.
        /// </summary>
        public async Task InvokeAsync(HttpContext context, IConfiguration configuration)
        {
            try
            {
                // استخراج Authorization Header / Extract Authorization header
                var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

                if (!string.IsNullOrEmpty(token))
                {
                    // التحقق من صحة Token / Validate token signature and expiration
                    AttachUserToContext(context, token, configuration);
                }
            }
            catch (Exception ex)
            {
                // تسجيل الأخطاء دون توقف معالجة الطلب / Log errors without stopping request processing
                _logger.LogWarning($"خطأ في التحقق من Token: {ex.Message} / Token validation error: {ex.Message}");
            }

            // نقل الطلب إلى Middleware التالي / Pass request to next middleware
            await _next(context);
        }

        /// <summary>
        /// إرفاق بيانات المستخدم من Token إلى Context / Attach user data from token to context
        /// ⚠️ WARNING: This method is deprecated. Use AddJwtBearer in Program.cs instead.
        /// </summary>
        private void AttachUserToContext(HttpContext context, string token, IConfiguration configuration)
        {
            try
            {
                // الحصول على مفتاح التوقيع / Get signing key
                var jwtSecret = configuration["Jwt:Secret"];
                if (string.IsNullOrEmpty(jwtSecret))
                {
                    _logger.LogError("JWT Secret غير موجود في الإعدادات / JWT Secret not found in configuration");
                    return;
                }

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
                var handler = new JwtSecurityTokenHandler();

                // التحقق من صحة Token / Validate token
                var principal = handler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero,
                    // ⚠️ CRITICAL: Match these with Program.cs AddJwtBearer configuration
                    RoleClaimType = ClaimTypes.Role,
                    NameClaimType = ClaimTypes.Name
                }, out SecurityToken validatedToken);

                // إرفاق المستخدم بـ Context / Attach principal to context
                context.User = principal;
                _logger.LogInformation("تم التحقق من Token بنجاح / Token validated successfully");
            }
            catch (SecurityTokenException ex)
            {
                _logger.LogWarning($"Token غير صحيح: {ex.Message} / Invalid token: {ex.Message}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"خطأ في معالجة Token: {ex.Message} / Error processing token: {ex.Message}");
            }
        }
    }
}
