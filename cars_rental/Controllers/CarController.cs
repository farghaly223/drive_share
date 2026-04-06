using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cars_rental.Models;

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
public async Task<IActionResult> AddCar(Car car)
{
    car.PostStatus = "Pending";

    _context.Cars.Add(car);
    await _context.SaveChangesAsync();

    // 👇 بدل ما تنادي BrowsingController
    var createdCar = await _context.Cars
        .Include(c => c.CarImages)
        .Include(c => c.Reviews)
        .FirstOrDefaultAsync(c => c.Id == car.Id);

    return Ok(createdCar);
}

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCar(int id, Car updatedCar)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
                return NotFound();


            car.Title = updatedCar.Title;
            car.Description = updatedCar.Description;
            car.CarType = updatedCar.CarType;
            car.Brand = updatedCar.Brand;
            car.Model = updatedCar.Model;
            car.Year = updatedCar.Year;
            car.Transmission = updatedCar.Transmission;
            car.Location = updatedCar.Location;
            car.RentalPrice = updatedCar.RentalPrice;

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