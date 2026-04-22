using cars_rental.Models;
using cars_rental.Repository;
using cars_rental.DTOs;

namespace cars_rental.Service
{
    public class CarsService : ICarsService
    {
        private readonly ICarsRepository _repository;
        public CarsService(ICarsRepository repository) => _repository = repository;

        public async Task<string> AddCarAsync(int ownerId, CarCreateUpdateDto dto)
        {
            var car = new Car
            {
                Title = dto.Title,
                Description = dto.Description,
                CarType = dto.CarType,
                Brand = dto.Brand,
                Model = dto.Model,
                Year = dto.Year,
                Transmission = dto.Transmission,
                Location = dto.Location,
                RentalPrice = dto.RentalPrice,
                OwnerId = ownerId,
                RentalStatus = "available", 
                PostStatus = "pending",
                AvailabilityCalendar = dto.AvailabilityCalendar
            };
            await _repository.AddAsync(car);
            await _repository.SaveChangesAsync();
            return "Car post created and pending admin approval";
        }

        public async Task<(bool Success, string Message)> ManageCarPostAsync(int id, bool approve)
        {
            var car = await _repository.GetByIdAsync(id);
            if (car == null) return (false, "Car post not found");

            car.PostStatus = approve ? "approved" : "rejected"; 
            await _repository.SaveChangesAsync();
            return (true, approve ? "Car post approved" : "Car post rejected");
        }

        public async Task<(bool Success, string Message, int StatusCode)> DeleteCarAsync(int carId, int currentUserId)
        {
            var car = await _repository.GetByIdWithBookingsAsync(carId);
            if (car == null) return (false, "Not Found", 404);

            if (car.OwnerId != currentUserId) return (false, "Forbidden", 403);

            
            if (car.Bookings.Any(b => b.Status == "Accepted"))
                return (false, "Car Owner cannot delete a car post if the car is currently rented.", 400);

            _repository.Delete(car);
            await _repository.SaveChangesAsync();
            return (true, "Deleted", 204);
        }
        public async Task<IEnumerable<Car>> GetCarsByOwnerIdAsync(int ownerId)
        {
            return await _repository.GetCarsByOwnerIdAsync(ownerId);
        }

        public async Task<(bool Success, string Message)> UpdateCarAsync(int ownerId, int carId, CarCreateUpdateDto carDto)
        {
            var car = await _repository.GetCarByIdAsync(carId);

            if (car == null) return (false, "Car not found");
            if (car.OwnerId != ownerId) return (false, "Unauthorized to update this car");

            car.Title = carDto.Title;
            car.Description = carDto.Description;
            car.CarType = carDto.CarType;
            car.Brand = carDto.Brand;
            car.Model = carDto.Model;
            car.Year = carDto.Year;
            car.Transmission = carDto.Transmission;
            car.Location = carDto.Location;
            car.RentalPrice = carDto.RentalPrice;
            car.AvailabilityCalendar = carDto.AvailabilityCalendar;

            await _repository.UpdateCarAsync(car);
            return (true, "Car updated successfully");
        }
    }
}
