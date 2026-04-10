using System.ComponentModel.DataAnnotations;

namespace cars_rental.DTOs
{
    public class BookingDto
    {
        [Required]
        public int CarId { get; set; }

        [Required]
        public DateOnly StartDate { get; set; }

        [Required]
        public DateOnly EndDate { get; set; }
    }

    public class BookingStatusUpdateDto
    {
        public bool Accept { get; set; }
    }

    public class BookingResponseDto
    {
        public int Id { get; set; }
        public string CarTitle { get; set; }
        public string Status { get; set; }
        public decimal TotalPrice { get; set; }
    }

}


