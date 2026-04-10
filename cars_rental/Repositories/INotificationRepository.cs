using cars_rental.Models;

public interface INotificationRepository
{
    Task AddAsync(Notification notification);
    Task SaveAsync();
    Task<List<Notification>> GetByUserIdAsync(int userId);
}