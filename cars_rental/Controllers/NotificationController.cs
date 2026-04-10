using cars_rental.DTOs;
using cars_rental.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _service;

    public NotificationController(INotificationService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> SendNotification(CreateNotificationDto dto)
    {
        await _service.SendNotification(dto);
        return Ok("Notification Sent");
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserNotifications(int userId)
    {
        var result = await _service.GetUserNotifications(userId);
        return Ok(result);
    }
}