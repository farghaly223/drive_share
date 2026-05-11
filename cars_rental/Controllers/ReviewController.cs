using System.Security.Claims;
using System.Threading.Tasks;
using cars_rental.DTOs;
using cars_rental.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace cars_rental.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ReviewController : ControllerBase {
    private readonly IReviewService _service;
    public ReviewController(IReviewService service) => _service = service;

    [HttpGet("car/{carId}")]
    public async Task<IActionResult> GetCarReviews(int carId) => Ok(await _service.GetCarReviewsAsync(carId));

    [HttpPost]
    [Authorize(Roles = "renter")]
    public async Task<IActionResult> AddReview([FromBody] ReviewCreateDto dto) {
        var renterId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (!await _service.AddReviewAsync(dto, renterId)) return BadRequest("Review exists.");
        return Ok("Review added.");
    }
}