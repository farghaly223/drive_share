using cars_rental.DTOs;
using cars_rental.Models;
using cars_rental.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace cars_rental.Controllers
{
    /// <summary>
    /// متحكم المصادقة والتفويض
    /// Authentication and Authorization Controller
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        /// <summary>
        /// مُنشئ متحكم المصادقة / Auth Controller Constructor
        /// </summary>
        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// تسجيل مستخدم جديد / Register a New User
        /// </summary>
        /// <param name="dto">بيانات التسجيل / Registration data</param>
        /// <returns>رسالة النجاح أو الفشل مع JWT Token / Success/Failure response with JWT Token</returns>
        /// <response code="200">تم التسجيل بنجاح / Registration successful</response>
        /// <response code="400">بيانات غير صحيحة / Invalid data</response>
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
        {
            // التحقق من صحة البيانات المدخلة / Validate input data
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "بيانات غير صحيحة / Invalid data", errors = ModelState });
            }

            // استدعاء خدمة التسجيل / Call registration service
            var result = await _authService.RegisterAsync(dto);

            if (!result.Success)
            {
                _logger.LogWarning($"فشل التسجيل: {result.Message} / Registration failed: {result.Message}");
                return BadRequest(result);
            }

            _logger.LogInformation($"تم التسجيل بنجاح: {dto.Email} / User registered successfully: {dto.Email}");
            return Ok(result);
        }

        /// <summary>
        /// تسجيل دخول المستخدم / User Login
        /// </summary>
        /// <param name="dto">بيانات الدخول / Login credentials</param>
        /// <returns>JWT Token وبيانات المستخدم / JWT Token and user information</returns>
        /// <response code="200">تم تسجيل الدخول بنجاح / Login successful</response>
        /// <response code="401">بيانات دخول غير صحيحة / Invalid credentials</response>
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
        {
            // التحقق من صحة البيانات المدخلة / Validate input data
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "بيانات غير صحيحة / Invalid data" });
            }

            // استدعاء خدمة تسجيل الدخول / Call login service
            var result = await _authService.LoginAsync(dto);

            if (!result.Success)
            {
                _logger.LogWarning($"فشل تسجيل الدخول: {result.Message} / Login failed: {result.Message}");
                return Unauthorized(result);
            }

            _logger.LogInformation($"تسجيل دخول ناجح: {dto.Email} / Successful login: {dto.Email}");
            return Ok(result);
        }

        /// <summary>
        /// اختبار - التحقق من أن المستخدم مسجل دخول / Test - Verify User is Authenticated
        /// </summary>
        /// <returns>بيانات المستخدم الحالي / Current user information</returns>
        /// <response code="200">المستخدم مصرح له / User is authorized</response>
        /// <response code="401">غير مصرح / Unauthorized</response>
        [HttpGet("me")]
        [Authorize]
        public IActionResult GetCurrentUser([FromServices] CarRentalDbContext dbContext)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            var nameClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Name);
            var emailClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Email);
            var roleClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role);

            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "لم يتم العثور على معرف المستخدم / User ID not found" });
            }

            int userId = int.Parse(userIdClaim.Value);

            // ✅ Declare the user variable
            var user = dbContext.Users.FirstOrDefault(u => u.Id == userId);

            return Ok(new
            {
                id = userIdClaim.Value,
                name = nameClaim?.Value,
                email = emailClaim?.Value,
                role = roleClaim?.Value,

                // New permission fields – user is now defined
                isSuspended = user?.IsSuspended ?? false,
                canAddCars = user?.CanAddCars ?? false,
                canRentCars = user?.CanRentCars ?? false,

                allClaims = User.Claims.Select(c => new { type = c.Type, value = c.Value }).ToList(),
                message = "✅ Current user information with all claims"
            });
        }

        /// <summary>
        /// اختبار - إذن خاص بـ Admin فقط / Test - Admin Only Access
        /// </summary>
        /// <returns>رسالة للـ Admin / Admin message</returns>
        /// <response code="200">المستخدم هو Admin / User is Admin</response>
        /// <response code="403">ممنوع - ليس Admin / Forbidden - Not Admin</response>
        [HttpGet("admin-only")]
        [Authorize(Roles = "admin")] // ✅ Use lowercase to match database storage
        public IActionResult AdminOnlyEndpoint()
        {
            return Ok(new { message = "مرحباً Admin! / Welcome Admin!" });
        }

        /// <summary>
        /// اختبار - إذن خاص بـ Owner و Admin / Test - Owner and Admin Access
        /// </summary>
        /// <returns>رسالة للـ Owner / Owner message</returns>
        /// <response code="200">المستخدم هو Owner أو Admin / User is Owner or Admin</response>
        /// <response code="403">ممنوع / Forbidden</response>
        [HttpGet("owner-access")]
        [Authorize(Roles = "owner,admin")] // ✅ Use lowercase
        public IActionResult OwnerAccessEndpoint()
        {
            return Ok(new { message = "مرحباً Owner! / Welcome Owner!" });
        }

        /// <summary>
        /// 🔧 DEBUG - Check database roles (Admin only)
        /// </summary>
        [HttpGet("debug/roles")]
        [Authorize(Roles = "admin")]
        public IActionResult DebugRoles([FromServices] CarRentalDbContext dbContext)
        {
            try
            {
                var users = dbContext.Users.Select(u => new { u.Id, u.Email, u.Role, u.CanAddCars, u.CanRentCars, u.IsSuspended }).ToList();

                return Ok(new
                {
                    message = "🔍 All users and their roles in database",
                    users = users,
                    currentUserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <param name="userId">معرف المستخدم / User ID</param>
        /// <param name="newRole">الدور الجديد / New Role</param>
        /// <returns>رسالة التحديث / Update message</returns>
        /// <response code="200">تم التحديث بنجاح / Successfully updated</response>
        /// <response code="403">ممنوع - يتطلب صلاحيات Admin / Forbidden - Admin rights required</response>
        [HttpPut("update-role/{userId}")]
        [Authorize(Roles = "admin")] // ✅ Use lowercase
        public IActionResult UpdateUserRole(int userId, [FromBody] string newRole)
        {
            // التحقق من صحة الدور / Validate role
            var validRoles = new[] { "admin", "owner", "renter" }; // ✅ Use lowercase
            if (!validRoles.Contains(newRole.ToLower()))
            {
                return BadRequest(new { message = $"دور غير صحيح. الأدوار الصحيحة: {string.Join(", ", validRoles)} / Invalid role" });
            }

            // هنا يجب تنفيذ منطق تحديث الدور في الخدمة / Implement role update logic in service
            return Ok(new { message = $"تم تحديث دور المستخدم {userId} إلى {newRole.ToLower()} / User {userId} role updated to {newRole.ToLower()}" });
        }
        [Authorize(Roles = "renter")]
        [HttpPost("upload-license")]
        public async Task<IActionResult> UploadLicense([FromBody] string licenseUrl)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _authService.UploadLicenseAsync(userId, licenseUrl);

            if (result) return Ok(new { message = "تم رفع الرخصة بنجاح، بانتظار مراجعة الإدارة." });
            return BadRequest("فشل في رفع الرخصة.");
        }
    }
}
