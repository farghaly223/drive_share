using cars_rental.DTOs;

namespace cars_rental.Services
{
    public interface INotificationService
    {
        Task SendNotificationAsync(int userId, string message);
        Task<List<NotificationDto>> GetUserNotificationsAsync(int userId); // Changed return type
        Task MarkAllReadAsync(int userId);
    }
}