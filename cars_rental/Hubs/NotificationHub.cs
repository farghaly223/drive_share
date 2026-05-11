using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace cars_rental.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            // Safely extract the user ID
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier) ?? 
                         Context.User?.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? 
                         Context.User?.FindFirstValue("id");

            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
            }

            await base.OnConnectedAsync();
        }
    }
}