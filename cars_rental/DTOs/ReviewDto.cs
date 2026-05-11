namespace cars_rental.DTOs;
public class ReviewDto : ReviewCreateDto {
    public int Id { get; set; }
    public int RenterId { get; set; }
}