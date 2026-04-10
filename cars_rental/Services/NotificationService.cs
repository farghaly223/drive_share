using cars_rental.DTOs;
using cars_rental.Hubs;
using cars_rental.Models;
using Microsoft.AspNetCore.SignalR;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _repo;
    private readonly IHubContext<NotificationHub> _hub;

    public NotificationService(
        INotificationRepository repo,
        IHubContext<NotificationHub> hub)
    {
        _repo = repo;
        _hub = hub;
    }

    public async Task SendNotification(CreateNotificationDto dto)
    {
        // 🧱 1. save in DB
        var notification = new Notification
        {
            UserId = dto.UserId,
            Message = dto.Message,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        await _repo.AddAsync(notification);
        await _repo.SaveAsync();

        // ⚡ 2. send real-time
        await _hub.Clients.All.SendAsync("ReceiveNotification", dto.Message);

        // 🔒 بعدين نخليها:
        // await _hub.Clients.User(dto.UserId.ToString())
        //     .SendAsync("ReceiveNotification", dto.Message);
    }

    public async Task<List<NotificationResponseDto>> GetUserNotifications(int userId)
    {
        var notifications = await _repo.GetByUserIdAsync(userId);

        return notifications.Select(n => new NotificationResponseDto
        {
            Id = n.Id,
            Message = n.Message,
            IsRead = n.IsRead,
            CreatedAt = n.CreatedAt
        }).ToList();
    }
}