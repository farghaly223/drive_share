using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cars_rental.Models;
using cars_rental.DTOs;

namespace cars_rental.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrowsingController : ControllerBase
    {
        private readonly CarRentalDbContext _context;

        public BrowsingController(CarRentalDbContext context)
        {
            _context = context;
        }

        // 1. Get All Cars (Now with Owner and Full Details)
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<CarListingDTO>>> GetAllCars()
        {
            var cars = await _context.Cars
                .Include(c => c.Owner) // Critical: To get Owner Name
                .Include(c => c.CarImages)
                .Where(c => c.PostStatus == "approved")
                .Select(c => new CarListingDTO
                {
                    Id = c.Id,
                    OwnerName = c.Owner.Name,
                    Title = c.Title,
                    Description = c.Description,
                    Brand = c.Brand,
                    Model = c.Model,
                    Year = c.Year ?? 2024,
                    CarType = c.CarType,
                    Location = c.Location,
                    RentalPrice = c.RentalPrice,
                    RentalStatus = "Available", // You can logic this based on existing bookings
                    Transmission = c.Transmission.ToString(),
                    MainImageUrl = c.CarImages.OrderByDescending(img => img.IsMain).Select(img => img.ImageUrl).FirstOrDefault()
                })
                .ToListAsync();

            return Ok(cars);
        }

        // 2. Filter Cars (Updated with all search fields)
        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<CarListingDTO>>> FilterCars(
    [FromQuery] string? search,
    [FromQuery] decimal? maxPrice,
    [FromQuery] string? transmission,
    [FromQuery] string? location,
    [FromQuery] string? carType)
        {
            var query = _context.Cars
                .Include(c => c.Owner)
                .Include(c => c.CarImages)
                .Where(c => c.PostStatus == "approved").AsQueryable();

            // Search by Brand or Model
            if (!string.IsNullOrEmpty(search))
                query = query.Where(c => c.Brand.Contains(search) || c.Model.Contains(search));

            // Filter by Location
            if (!string.IsNullOrEmpty(location))
                query = query.Where(c => c.Location.Contains(location));

            // Filter by CarType (Exact Match to avoid null/empty issues)
            if (!string.IsNullOrEmpty(carType))
                query = query.Where(c => c.CarType == carType);

            if (maxPrice.HasValue)
                query = query.Where(c => c.RentalPrice <= maxPrice.Value);

            if (!string.IsNullOrEmpty(transmission))
                query = query.Where(c => c.Transmission == transmission);

            var cars = await query.Select(c => new CarListingDTO
            {
                Id = c.Id,
                OwnerName = c.Owner.Name,
                Title = c.Title,
                Description = c.Description,
                Brand = c.Brand,
                Model = c.Model,
                Year = c.Year ?? 2024,
                // هنا بنضمن إن الـ Type ميبقاش null لو الداتا بيز فاضية
                CarType = c.CarType ?? "Not Specified",
                Location = c.Location,
                RentalPrice = c.RentalPrice,
                RentalStatus = "Available",
                Transmission = c.Transmission.ToString(),
                MainImageUrl = c.CarImages.OrderByDescending(img => img.IsMain).Select(img => img.ImageUrl).FirstOrDefault()
            }).ToListAsync();

            return Ok(cars);
        }

        // 3. Get Single Car Details
        [HttpGet("{id}")]
        public async Task<ActionResult<CarListingDTO>> GetCarById(int id)
        {
            var car = await _context.Cars
                .Include(c => c.Owner)
                .Include(c => c.CarImages)
                .Where(c => c.Id == id)
                .Select(c => new CarListingDTO
                {
                    Id = c.Id,
                    OwnerName = c.Owner.Name,
                    Title = c.Title,
                    Description = c.Description,
                    Brand = c.Brand,
                    Model = c.Model,
                    Year = c.Year ?? 2024,
                    CarType = c.CarType,
                    Location = c.Location,
                    RentalPrice = c.RentalPrice,
                    RentalStatus = "Available",
                    Transmission = c.Transmission.ToString(),
                    MainImageUrl = c.CarImages.OrderByDescending(img => img.IsMain).Select(img => img.ImageUrl).FirstOrDefault()
                })
                .FirstOrDefaultAsync();

            if (car == null) return NotFound();

            return Ok(car);
        }
    }
}