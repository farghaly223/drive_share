namespace cars_rental.DTOs
{
    public class CarListingDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public decimal? RentalPrice { get; set; }
        public string? Location { get; set; }
        public string? CarType { get; set; }
        public string? Transmission { get; set; }

        public string? MainImageUrl { get; set; }
    }
}