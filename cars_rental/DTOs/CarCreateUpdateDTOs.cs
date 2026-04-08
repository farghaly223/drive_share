public class CarCreateUpdateDto
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string? CarType { get; set; }
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public int? Year { get; set; }
    public string? Transmission { get; set; }
    public string? Location { get; set; }
    public decimal? RentalPrice { get; set; }

    public string? AvailabilityCalendar { get; set; }
}