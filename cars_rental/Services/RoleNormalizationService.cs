using cars_rental.Models;

namespace cars_rental.Service
{
    /// <summary>
    /// خدمة لتصحيح حالات الأدوار (تحويلها لـ lowercase)
    /// Service to fix user roles to ensure they are all lowercase for consistency
    /// </summary>
    public class RoleNormalizationService
    {
        private readonly CarRentalDbContext _context;
        private readonly ILogger<RoleNormalizationService> _logger;

        public RoleNormalizationService(CarRentalDbContext context, ILogger<RoleNormalizationService> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// تصحيح جميع الأدوار في قاعدة البيانات لتكون lowercase
        /// Normalize all user roles to lowercase
        /// </summary>
        public async Task NormalizeAllRolesAsync()
        {
            try
            {
                var usersWithMixedCaseRoles = _context.Users
                    .Where(u => u.Role != null && u.Role != u.Role.ToLower())
                    .ToList();

                if (usersWithMixedCaseRoles.Count == 0)
                {
                    _logger.LogInformation("✅ All user roles are already normalized (lowercase)");
                    return;
                }

                _logger.LogWarning($"🔧 Found {usersWithMixedCaseRoles.Count} users with mixed-case roles. Normalizing...");

                foreach (var user in usersWithMixedCaseRoles)
                {
                    var originalRole = user.Role;
                    user.Role = user.Role.ToLower().Trim();
                    _logger.LogInformation($"  - User {user.Id} ({user.Email}): '{originalRole}' → '{user.Role}'");
                }

                await _context.SaveChangesAsync();
                _logger.LogInformation($"✅ Successfully normalized {usersWithMixedCaseRoles.Count} user roles");
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error normalizing roles: {ex.Message}");
                throw;
            }
        }
    }
}
