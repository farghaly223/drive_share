using System.Collections.Generic;
using System.Threading.Tasks;
using cars_rental.Models;

namespace cars_rental.Repositories;
public interface INotificationRepository {
    Task<IEnumerable<Notification>> GetUserNotificationsAsync(int userId);
    Task MarkAsReadAsync(int notificationId);
    Task AddNotificationAsync(Notification notification);
}