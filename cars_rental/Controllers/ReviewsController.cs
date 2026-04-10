using cars_rental.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _service;

    public ReviewsController(IReviewService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> AddReview(CreateReviewDto dto)
    {
        // var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        var userId = 1;
        var result = await _service.AddReview(dto, userId);

        return Ok(result);
    }

    [HttpGet("car/{carId}")]
    public async Task<IActionResult> GetCarReviews(int carId)
    {
        var reviews = await _service.GetCarReviews(carId);

        return Ok(reviews);
    }
}