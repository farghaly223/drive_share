using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cars_rental.Models; // تأكد إن ده اسم الـ namespace بتاع الـ Context عندك
using cars_rental.Models;

[Route("api/[controller]")]
[ApiController]
public class BrowsingController : ControllerBase
{
    private readonly CarRentalDbContext _context; // تأكد من اسم الـ Context هنا

    public BrowsingController(CarRentalDbContext context)
    {
        _context = context;
    }

    // تست بسيط: هل الداتا بيز شغالة وبترجع داتا؟
    [HttpGet("test-db")]
    public async Task<IActionResult> TestDatabase()
    {
        try
        {
            // هنحاول نجيب أول عربية موجودة في الجدول
            var firstCar = await _context.Cars.FirstOrDefaultAsync();

            if (firstCar == null)
            {
                return Ok(new { message = "Connected! But the Cars table is empty." });
            }

            return Ok(new { message = "Success! Connected to Database.", data = firstCar });
        }
        catch (Exception ex)
        {
            // لو فيه مشكلة في الباسورد أو السيرفر هيظهر هنا
            return BadRequest(new { message = "Connection Failed!", error = ex.Message });
        }
    }
}