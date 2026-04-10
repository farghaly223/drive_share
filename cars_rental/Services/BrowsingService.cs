using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using cars_rental.DTOs;
using cars_rental.Models;
using cars_rental.Interfaces;

namespace cars_rental.Services
{
    public class BrowsingService : IBrowsingService
    {
        private readonly IBrowsingRepository _repo;
        public BrowsingService(IBrowsingRepository repo) => _repo = repo;

        public async Task<IEnumerable<CarListingDTO>> GetAllCarsAsync()
        {
            var cars = await _repo.GetApprovedCarsAsync();
            return cars.Select(MapToDTO);
        }

        public async Task<IEnumerable<CarListingDTO>> FilterCarsAsync(string? search, decimal? maxPrice, string? location, string? carType)
        {
            var cars = await _repo.GetApprovedCarsAsync();
            var query = cars.AsQueryable();

            if (!string.IsNullOrEmpty(search))
                query = query.Where(c => (c.Brand != null && c.Brand.Contains(search)) || (c.Model != null && c.Model.Contains(search)));

            if (!string.IsNullOrEmpty(location))
                query = query.Where(c => c.Location != null && c.Location.Contains(location));

            if (!string.IsNullOrEmpty(carType))
                query = query.Where(c => c.CarType == carType);

            if (maxPrice.HasValue)
                query = query.Where(c => c.RentalPrice <= maxPrice.Value);

            return query.Select(MapToDTO);
        }

        public async Task<CarListingDTO?> GetCarDetailsAsync(int id)
        {
            var car = await _repo.GetCarByIdAsync(id);
            return car == null ? null : MapToDTO(car);
        }

        private CarListingDTO MapToDTO(Car c) => new CarListingDTO
        {
            Id = c.Id,
            OwnerName = c.Owner?.Name ?? "Unknown Owner",
            Title = c.Title,
            Description = c.Description,
            Brand = c.Brand,
            Model = c.Model,
            Year = c.Year ?? 2024,
            CarType = c.CarType ?? "Not Specified",
            Location = c.Location,
            RentalPrice = c.RentalPrice,
            RentalStatus = "Available",
            Transmission = c.Transmission?.ToString() ?? "N/A",
            MainImageUrl = c.CarImages?.OrderByDescending(img => img.IsMain)
                                      .Select(img => img.ImageUrl)
                                      .FirstOrDefault() ?? "default_car.png"
        };
    }
}