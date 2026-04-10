using cars_rental.DTOs;

public interface INotificationService
{
    Task SendNotification(CreateNotificationDto dto);
    Task<List<NotificationResponseDto>> GetUserNotifications(int userId);
}