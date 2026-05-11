namespace cars_rental.DTOs;
public class ReviewCreateDto {
    public int BookingId { get; set; }
    public int CarId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
}