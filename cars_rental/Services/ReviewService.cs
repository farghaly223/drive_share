using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using cars_rental.DTOs;
using cars_rental.Models;
using cars_rental.Repositories;

namespace cars_rental.Services;
public class ReviewService : IReviewService {
    private readonly IReviewRepository _repository;
    public ReviewService(IReviewRepository repository) => _repository = repository;

    public async Task<IEnumerable<ReviewDto>> GetCarReviewsAsync(int carId) {
        var reviews = await _repository.GetCarReviewsAsync(carId);
        return reviews.Select(r => new ReviewDto { Id = r.Id, BookingId = r.BookingId, CarId = r.CarId, RenterId = r.RenterId, Rating = r.Rating ?? 0, Comment = r.Comment });
    }

    public async Task<bool> AddReviewAsync(ReviewCreateDto dto, int renterId) {
        if (await _repository.HasUserReviewedBookingAsync(dto.BookingId, renterId)) return false;
        await _repository.AddReviewAsync(new Review { BookingId = dto.BookingId, CarId = dto.CarId, RenterId = renterId, Rating = dto.Rating, Comment = dto.Comment });
        return true;
    }
}