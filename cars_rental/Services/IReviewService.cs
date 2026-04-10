using cars_rental.DTOs;

public interface IReviewService
{
    Task<ReviewResponseDto> AddReview(CreateReviewDto dto, int renterId);
    Task<List<ReviewResponseDto>> GetCarReviews(int carId);
}