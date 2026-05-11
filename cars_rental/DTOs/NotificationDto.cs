using System;
namespace cars_rental.DTOs;
public class NotificationDto {
    public int Id { get; set; }
    public string Message { get; set; } = null!;
    public bool? IsRead { get; set; }
    public DateTime? CreatedAt { get; set; }
}