using System.Collections.Generic;
using System.Threading.Tasks;
using cars_rental.DTOs;

namespace cars_rental.Services;
public interface IReviewService {
    Task<IEnumerable<ReviewDto>> GetCarReviewsAsync(int carId);
    Task<bool> AddReviewAsync(ReviewCreateDto dto, int renterId);
}