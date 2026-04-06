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

        // 1. عرض كل العربيات (مع الصور)
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<CarListingDTO>>> GetAllCars()
        {
            var cars = await _context.Cars
                .Where(c => c.PostStatus == "approved")
                .Select(c => new CarListingDTO
                {
                    Id = c.Id,
                    Title = c.Title,
                    Brand = c.Brand,
                    Model = c.Model,
                    RentalPrice = c.RentalPrice,
                    Location = c.Location,
                    CarType = c.CarType,
                    Transmission = c.Transmission == null ? null : c.Transmission.ToString(),
                    // السطر ده هو اللي بينور الصور في الفرونت
                    MainImageUrl = c.CarImages.OrderByDescending(img => img.IsMain).Select(img => img.ImageUrl).FirstOrDefault()
                })
                .ToListAsync();

            return Ok(cars);
        }

        // 2. عرض تفاصيل عربية واحدة بالـ ID
        [HttpGet("{id}")]
        public async Task<ActionResult<CarListingDTO>> GetCarById(int id)
        {
            var car = await _context.Cars
                .Where(c => c.Id == id)
                .Select(c => new CarListingDTO
                {
                    Id = c.Id,
                    Title = c.Title,
                    Brand = c.Brand,
                    Model = c.Model,
                    RentalPrice = c.RentalPrice,
                    Location = c.Location,
                    CarType = c.CarType,
                    Transmission = c.Transmission == null ? null : c.Transmission.ToString(),
                    MainImageUrl = c.CarImages.OrderByDescending(img => img.IsMain).Select(img => img.ImageUrl).FirstOrDefault()
                })
                .FirstOrDefaultAsync();

            if (car == null) return NotFound(new { message = "Car not found!" });

            return Ok(car);
        }

        // 3. الفلتر والبحث (تم إضافة الصور هنا أيضاً)
        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<CarListingDTO>>> FilterCars(
            [FromQuery] string? search,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? transmission)
        {
            var query = _context.Cars.Where(c => c.PostStatus == "approved").AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(c => c.Brand.Contains(search) || c.Model.Contains(search) || c.Title.Contains(search));
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(c => c.RentalPrice <= maxPrice.Value);
            }

            if (!string.IsNullOrEmpty(transmission))
            {
                query = query.Where(c => c.Transmission == transmission);
            }

            var cars = await query.Select(c => new CarListingDTO
            {
                Id = c.Id,
                Title = c.Title,
                Brand = c.Brand,
                Model = c.Model,
                RentalPrice = c.RentalPrice,
                Location = c.Location,
                CarType = c.CarType,
                Transmission = c.Transmission == null ? null : c.Transmission.ToString(),
                MainImageUrl = c.CarImages.OrderByDescending(img => img.IsMain).Select(img => img.ImageUrl).FirstOrDefault()
            }).ToListAsync();

            return Ok(cars);
        }
    }
}