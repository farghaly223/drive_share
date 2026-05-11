using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using cars_rental.Models;
using Microsoft.EntityFrameworkCore;

namespace cars_rental.Repositories;
public class ReviewRepository : IReviewRepository {
    private readonly CarRentalDbContext _context;
    public ReviewRepository(CarRentalDbContext context) => _context = context;

    public async Task<IEnumerable<Review>> GetCarReviewsAsync(int carId) {
        return await _context.Reviews.Where(r => r.CarId == carId).ToListAsync();
    }

    public async Task AddReviewAsync(Review review) {
        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> HasUserReviewedBookingAsync(int bookingId, int renterId) {
        return await _context.Reviews.AnyAsync(r => r.BookingId == bookingId && r.RenterId == renterId);
    }
}