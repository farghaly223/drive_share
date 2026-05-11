using System.Collections.Generic;
using System.Threading.Tasks;
using cars_rental.Models;

namespace cars_rental.Repositories;
public interface IReviewRepository {
    Task<IEnumerable<Review>> GetCarReviewsAsync(int carId);
    Task AddReviewAsync(Review review);
    Task<bool> HasUserReviewedBookingAsync(int bookingId, int renterId);
}