using cars_rental.DTOs;
using cars_rental.Hubs;
using cars_rental.Models;
using cars_rental.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace cars_rental.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _repository;
        private readonly IHubContext<NotificationHub> _hub;

        public NotificationService(INotificationRepository repository, IHubContext<NotificationHub> hub)
        {
            _repository = repository;
            _hub = hub;
        }

        public async Task SendNotificationAsync(int userId, string message)
        {
            var notification = new Notification
            {
                UserId = userId,
                Message = message,
                IsRead = false,
                CreatedAt = DateTime.Now
            };
            
            await _repository.AddNotificationAsync(notification);

            await _hub.Clients.Group($"user_{userId}")
                      .SendAsync("ReceiveNotification", message);
        }

        // Updated to return DTOs
        public async Task<List<NotificationDto>> GetUserNotificationsAsync(int userId)
        {
            var notifications = await _repository.GetUserNotificationsAsync(userId);
            return notifications.Where(n => n.IsRead != true).Select(n => new NotificationDto
            {
                Id = n.Id,
                Message = n.Message,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            }).ToList();
        }

        public async Task MarkAllReadAsync(int userId)
        {
            var notifications = await _repository.GetUserNotificationsAsync(userId);
            foreach (var n in notifications.Where(x => x.IsRead != true))
            {
                await _repository.MarkAsReadAsync(n.Id);
            }
        }
    }
}