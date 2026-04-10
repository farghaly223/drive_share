using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace cars_rental.Handlers
{
    /// <summary>
    /// Custom handler to debug role authorization issues
    /// </summary>
    public class RoleAuthorizationHandler : AuthorizationHandler<RoleAuthorizationRequirement>
    {
        private readonly ILogger<RoleAuthorizationHandler> _logger;

        public RoleAuthorizationHandler(ILogger<RoleAuthorizationHandler> logger)
        {
            _logger = logger;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, RoleAuthorizationRequirement requirement)
        {
            // Log all claims for debugging
            _logger.LogWarning($"🔍 [AUTHORIZATION DEBUG] User: {context.User?.Identity?.Name ?? "UNKNOWN"}");
            _logger.LogWarning($"🔍 [AUTHORIZATION DEBUG] Is Authenticated: {context.User?.Identity?.IsAuthenticated}");
            _logger.LogWarning($"🔍 [AUTHORIZATION DEBUG] Required Role: {requirement.Role}");
            
            var allClaims = context.User?.Claims.Select(c => $"{c.Type}={c.Value}").ToList() ?? new();
            foreach (var claim in allClaims)
            {
                _logger.LogWarning($"🔍 [CLAIM] {claim}");
            }

            var roleClaim = context.User?.FindFirst(ClaimTypes.Role);
            _logger.LogWarning($"🔍 [ROLE CLAIM] ClaimTypes.Role = '{roleClaim?.Value ?? "NULL"}'");

            var customRoleClaim = context.User?.FindFirst("role");
            _logger.LogWarning($"🔍 [ROLE CLAIM] Custom 'role' = '{customRoleClaim?.Value ?? "NULL"}'");

            if (context.User?.IsInRole(requirement.Role) == true)
            {
                _logger.LogInformation($"✅ [AUTHORIZATION] User IS in role '{requirement.Role}'");
                context.Succeed(requirement);
            }
            else
            {
                _logger.LogWarning($"❌ [AUTHORIZATION] User NOT in role '{requirement.Role}'");
            }

            return Task.CompletedTask;
        }
    }

    public class RoleAuthorizationRequirement : IAuthorizationRequirement
    {
        public string Role { get; }

        public RoleAuthorizationRequirement(string role)
        {
            Role = role;
        }
    }
}
