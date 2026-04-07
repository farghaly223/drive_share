using cars_rental.DTOs;
using cars_rental.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace cars_rental.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly CarRentalDbContext _context;

        public BookingController(CarRentalDbContext context)
        {
            _context = context;
        }
        
        [Authorize(Roles = "Renter")]
        [HttpPost("request")]
        public async Task<IActionResult> RequestRental(BookingRequestDto request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _context.Users.FindAsync(userId);

          
            if (user.IsLicenseVerified != true)
                return BadRequest("Please submit your driver license for verification first.");

            var car = await _context.Cars.FindAsync(request.CarId);
            if (car == null || car.PostStatus != "Approved") return BadRequest("Car is not available for rental.");

            var booking = new Booking
            {
                CarId = request.CarId,
                RenterId = userId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Status = "Pending",
                CreatedAt = DateTime.Now
            };
            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();
            return Ok("Rental request sent successfully.");
        }

        [Authorize(Roles = "CarOwner")]
        [HttpPatch("{id}/respond")]
        public async Task<IActionResult> RespondToBooking(int id, [FromBody] bool accept)
        {
            var booking = await _context.Bookings.Include(b => b.Car).FirstOrDefaultAsync(b => b.Id == id);
            if (booking == null) return NotFound();

            var ownerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (booking.Car.OwnerId != ownerId) return Forbid();

            booking.Status = accept ? "Accepted" : "Rejected";

            if (accept) booking.Car.RentalStatus = "Rented";

            await _context.SaveChangesAsync();
            return Ok($"Booking has been {booking.Status}");
        }

        [Authorize(Roles = "CarOwner")]
        [HttpPatch("{id}/complete")]
        public async Task<IActionResult> CompleteBooking(int id)
        {
            var booking = await _context.Bookings.Include(b => b.Car).FirstOrDefaultAsync(b => b.Id == id);
            if (booking == null) return NotFound();

            booking.Status = "Completed";
            booking.Car.RentalStatus = "Available"; 

            await _context.SaveChangesAsync();
            return Ok("Rental completed. Renter can now leave feedback.");
        }
    }
}
