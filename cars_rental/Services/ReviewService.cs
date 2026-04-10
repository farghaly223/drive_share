using cars_rental.DTOs;
using cars_rental.Models;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _repo;

    public ReviewService(IReviewRepository repo)
    {
        _repo = repo;
    }

    public async Task<ReviewResponseDto> AddReview(CreateReviewDto dto, int renterId)
    {
        // 🔥 check: review already exists for booking
        if (await _repo.ExistsAsync(dto.BookingId))
            throw new Exception("Review already exists for this booking");

        var review = new Review
        {
            BookingId = dto.BookingId,
            CarId = dto.CarId,
            RenterId = renterId,
            Rating = dto.Rating,
            Comment = dto.Comment
        };

        await _repo.AddAsync(review);
        await _repo.SaveAsync();

        return new ReviewResponseDto
        {
            Id = review.Id,
            Rating = review.Rating ?? 0,
            Comment = review.Comment,
            RenterName = "You" // ممكن نجيبها من user later
        };
    }

    public async Task<List<ReviewResponseDto>> GetCarReviews(int carId)
    {
        var reviews = await _repo.GetByCarIdAsync(carId);

        return reviews.Select(r => new ReviewResponseDto
        {
            Id = r.Id,
            Rating = r.Rating ?? 0,
            Comment = r.Comment,
            RenterName = r.Renter.Name
        }).ToList();
    }
}