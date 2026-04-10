using cars_rental.DTOs;
using cars_rental.Models;
using cars_rental.Service;
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
        private readonly ICarsService _carsService;
        public CarsController(ICarsService carsService) => _carsService = carsService;

        [Authorize(Roles = "owner")]
        [HttpPost]
        public async Task<IActionResult>AddCar(CarCreateUpdateDto dto)
        {
            var ownerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var message = await _carsService.AddCarAsync(ownerId, dto);
            return Ok(message);
        }

        [Authorize(Roles = "admin")]
        [HttpPatch("manage-post/{id}")]
        public async Task<IActionResult> ManagePost(int id, [FromBody] bool approve)
        {
            var result = await _carsService.ManageCarPostAsync(id, approve);
            return result.Success ? Ok(new { message = result.Message }) : NotFound(result.Message);
        }

        [Authorize(Roles = "owner")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var result = await _carsService.DeleteCarAsync(id, currentUserId);

            if (!result.Success)
            {
                return result.StatusCode switch
                {
                    404 => NotFound(),
                    403 => Forbid(),
                    _ => BadRequest(result.Message)
                };
            }
            return NoContent();
        }

    }
}
