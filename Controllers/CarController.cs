using cars_rental.DTOs;
using cars_rental.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
namespace cars_rental.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarsController : ControllerBase
    {
        private readonly  CarRentalDbContext _context;

        public CarsController(CarRentalDbContext context)
        {
            _context = context;
        }


        [Authorize(Roles = "CarOwner")]
        [HttpPost]
        public async Task<IActionResult> AddCar(CarCreateUpdateDto dto)
        {
            var ownerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var car = new Car
            {
                Title = dto.Title,
                Description = dto.Description,
                CarType = dto.CarType,
                Brand = dto.Brand,
                Model = dto.Model,
                Year = dto.Year,
                Transmission = dto.Transmission,
                Location = dto.Location,
                RentalPrice = dto.RentalPrice,
                AvailabilityCalendar = dto.AvailabilityCalendar,
                RentalStatus = "Available",
                PostStatus = "Pending", 
                OwnerId = ownerId
            };
            _context.Cars.Add(car);
            await _context.SaveChangesAsync();
            return Ok("Car post created and pending admin approval");
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("manage-post/{id}")]
        public async Task<IActionResult> ManagePost(int id, [FromBody] bool approve)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null) return NotFound("Car post not found");

            car.PostStatus = approve ? "Approved" : "Rejected";
            await _context.SaveChangesAsync();
            return Ok(new { message = approve ? "Car post approved" : "Car post rejected" });
        }

       
        [Authorize(Roles = "CarOwner")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            var car = await _context.Cars.Include(c => c.Bookings).FirstOrDefaultAsync(c => c.Id == id);
            if (car == null) return NotFound();

            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (car.OwnerId != currentUserId) return Forbid();

            if (car.Bookings.Any(b => b.Status == "Accepted"))
                return BadRequest("Car Owner cannot delete a car post if the car is currently rented.");

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

}
