using cars_rental.Models;

public interface IReviewRepository
{
	Task AddAsync(Review review);
	Task SaveAsync();
	Task<List<Review>> GetByCarIdAsync(int carId);
	Task<bool> ExistsAsync(int bookingId);
}