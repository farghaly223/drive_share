using cars_rental.DTOs;
using cars_rental.Models;
using cars_rental.Service;
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
        private readonly IBookingService _bookingService;
        public BookingController(IBookingService bookingService) => _bookingService = bookingService;

        [Authorize(Roles = "renter")]
        [HttpPost("request")]
        public async Task<IActionResult> RequestRental(BookingDto request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var result = await _bookingService.CreateRentalRequestAsync(userId, request);

            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [Authorize(Roles = "owner")]
        [HttpPatch("{id}/respond")]
        public async Task<IActionResult> RespondToBooking(int id, [FromBody] bool accept)
        {
            var ownerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var result = await _bookingService.RespondToBookingAsync(ownerId, id, accept);

            if (result.StatusCode == 404) return NotFound(result.Message);
            if (result.StatusCode == 403) return Forbid();

            return Ok(result.Message);
        }

        [Authorize(Roles = "owner")]
        [HttpPatch("{id}/complete")]
        public async Task<IActionResult> CompleteBooking(int id)
        {
            var result = await _bookingService.CompleteBookingAsync(id);
            return result.Success ? Ok(result.Message) : NotFound(result.Message);
        }
    }
}
