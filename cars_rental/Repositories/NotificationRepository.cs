using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using cars_rental.Models;
using Microsoft.EntityFrameworkCore;

namespace cars_rental.Repositories;
public class NotificationRepository : INotificationRepository {
    private readonly CarRentalDbContext _context;
    public NotificationRepository(CarRentalDbContext context) => _context = context;

    public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(int userId) {
        return await _context.Notifications.Where(n => n.UserId == userId).OrderByDescending(n => n.CreatedAt).ToListAsync();
    }

    public async Task MarkAsReadAsync(int notificationId) {
        var notification = await _context.Notifications.FindAsync(notificationId);
        if (notification != null) {
            notification.IsRead = true;
            await _context.SaveChangesAsync();
        }
    }

    public async Task AddNotificationAsync(Notification notification) {
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();
    }
}