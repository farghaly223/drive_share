namespace cars_rental.DTOs
{
    public class AdminDTOs
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public string? DriverLicenseUrl { get; set; } // Added for license review
        public DateTime CreatedAt { get; set; }
    }
}