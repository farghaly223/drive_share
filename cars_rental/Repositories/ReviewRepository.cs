using cars_rental.Models;
using Microsoft.EntityFrameworkCore;

public class ReviewRepository : IReviewRepository
{
    private readonly CarRentalDbContext _context;

    public ReviewRepository(CarRentalDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Review review)
    {
        await _context.Reviews.AddAsync(review);
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<List<Review>> GetByCarIdAsync(int carId)
    {
        return await _context.Reviews
            .Include(r => r.Renter)
            .Where(r => r.CarId == carId)
            .ToListAsync();
    }

    public async Task<bool> ExistsAsync(int bookingId)
    {
        return await _context.Reviews.AnyAsync(r => r.BookingId == bookingId);
    }
}