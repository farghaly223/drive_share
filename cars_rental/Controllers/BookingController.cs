using cars_rental.DTOs;
using cars_rental.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace cars_rental.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly CarRentalDbContext _context;

        public BookingController(CarRentalDbContext context)
        {
            _context = context;
        }

        [HttpPost("request-rental")]
        public IActionResult RequestRental([FromBody] BookingRequestDto request)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            int userId = int.Parse(userIdStr);

            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null || user.IsLicenseVerified != true)
            {
                return BadRequest("Verify license first to book"); 
            }

            var isDateOverlap = _context.Bookings.Any(b =>
                b.CarId == request.CarId &&
                b.Status == "Accepted" &&
                ((request.StartDate >= b.StartDate && request.StartDate <= b.EndDate) ||
                 (request.EndDate >= b.StartDate && request.EndDate <= b.EndDate))); 

            if (isDateOverlap) return BadRequest("Car unavailable for these dates");

            var newBooking = new Booking
            {
                CarId = request.CarId,
                RenterId = userId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Status = "Pending",
                CreatedAt = DateTime.Now
            };

            _context.Bookings.Add(newBooking);
            _context.SaveChanges();
            return Ok("Booking request successfu");
        }

        [HttpPatch("{id}/respond")]
        public IActionResult RespondToBooking(int id, [FromBody] string response)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var booking = _context.Bookings.Include(b => b.Car).FirstOrDefault(b => b.Id == id);

            if (booking == null) return NotFound("Request not found.");
            if (booking.Car.OwnerId != userId) return Forbid("Not the car owner"); 

            booking.Status = response; 

            if (response == "Accepted")
            {
                booking.Car.PostStatus = "Rented"; 
            }

            _context.SaveChanges();
            return Ok($"Status changed to: {response}");
        }

        [HttpPatch("{id}/complete")]
        public IActionResult CompleteBooking(int id)
        {
            var booking = _context.Bookings.Include(b => b.Car).FirstOrDefault(b => b.Id == id);
            if (booking == null) return NotFound();

            booking.Status = "Completed";
            booking.Car.PostStatus = "Available"; 

            _context.SaveChanges();
            return Ok("Rental finished. Share your feedback");
        }

        [HttpGet("owner-requests")]
        public IActionResult GetOwnerRequests()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var requests = _context.Bookings
                .Include(b => b.Car)
                .Where(b => b.Car.OwnerId == userId)
                .ToList();

            return Ok(requests);
        }
    } 
}
