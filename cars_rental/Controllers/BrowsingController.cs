using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using cars_rental.DTOs;
using cars_rental.Interfaces;

namespace cars_rental.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrowsingController : ControllerBase
    {
        private readonly IBrowsingService _service;

        public BrowsingController(IBrowsingService service)
        {
            _service = service;
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<CarListingDTO>>> GetAllCars()
        {
            return Ok(await _service.GetAllCarsAsync());
        }

        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<CarListingDTO>>> FilterCars(
            [FromQuery] string? search,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? location,
            [FromQuery] string? carType)
        {
            return Ok(await _service.FilterCarsAsync(search, maxPrice, location, carType));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CarListingDTO>> GetCarById(int id)
        {
            var car = await _service.GetCarDetailsAsync(id);
            if (car == null) return NotFound(new { message = "Car not found" });
            return Ok(car);
        }
    }
}