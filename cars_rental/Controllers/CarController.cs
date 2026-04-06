using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cars_rental.Models;
using cars_rental.DTOs;
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

[HttpPost]
public async Task<IActionResult> AddCar(CarCreateUpdateDto dto)
{
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
        PostStatus = "Pending"
    };

    _context.Cars.Add(car);
    await _context.SaveChangesAsync();

    var createdCar = await _context.Cars
        .Include(c => c.CarImages)
        .Include(c => c.Reviews)
        .FirstOrDefaultAsync(c => c.Id == car.Id);

    return Ok(createdCar);
}
      [HttpPut("{id}")]
public async Task<IActionResult> UpdateCar(int id, CarCreateUpdateDto dto)
{
    var car = await _context.Cars.FindAsync(id);

    if (car == null)
        return NotFound();

    car.Title = dto.Title;
    car.Description = dto.Description;
    car.CarType = dto.CarType;
    car.Brand = dto.Brand;
    car.Model = dto.Model;
    car.Year = dto.Year;
    car.Transmission = dto.Transmission;
    car.Location = dto.Location;
    car.RentalPrice = dto.RentalPrice;

    await _context.SaveChangesAsync();

    return NoContent();
}

        // ✅ Delete Car (Owner - لو مش متأجرة)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            var car = await _context.Cars
                .Include(c => c.Bookings)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (car == null)
                return NotFound();

            // ❌ مينفعش تمسحي لو العربية متأجرة
            if (car.Bookings.Any(b => b.Status == "Accepted"))
                return BadRequest("Car is currently rented");

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ Admin Approve Car
        [HttpPut("approve/{id}")]
        public async Task<IActionResult> ApproveCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
                return NotFound();

            car.PostStatus = "Approved";

            await _context.SaveChangesAsync();

            return Ok("Car Approved");
        }

        // ❌ Admin Reject Car
        [HttpPut("reject/{id}")]
        public async Task<IActionResult> RejectCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
                return NotFound();

            car.PostStatus = "Rejected";

            await _context.SaveChangesAsync();

            return Ok("Car Rejected");
        }
    }
}
