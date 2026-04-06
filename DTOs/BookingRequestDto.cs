namespace cars_rental.DTOs
{
    public class BookingRequestDto
    {

            public int CarId { get; set; }
            public DateOnly StartDate { get; set; } 
            public DateOnly EndDate { get; set; }
            public decimal? TotalPrice { get; set; }
       
    }

}

