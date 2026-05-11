using cars_rental.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace cars_rental.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
            => _notificationService = notificationService;

        // Helper to safely extract User ID from JWT claims
        private int GetUserId()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? 
                            User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? 
                            User.FindFirstValue("id");
                            User.FindFirstValue("UserId");
                            
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                throw new UnauthorizedAccessException("User ID claim not found in token.");
            }
            return userId;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyNotifications()
        {
            try
            {
                var userId = GetUserId();
                var notifications = await _notificationService.GetUserNotificationsAsync(userId);
                return Ok(new { 
                    ExtractedUserId = userId, 
                    NotificationsFound = notifications.Count,
                    Data = notifications 
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPatch("read")]
        public async Task<IActionResult> MarkAllRead()
        {
            try
            {
                var userId = GetUserId();
                await _notificationService.MarkAllReadAsync(userId);
                return Ok(new { message = "All notifications marked as read." });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }
    }
}