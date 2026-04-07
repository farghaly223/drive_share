using System;
using System.Collections.Generic;

namespace cars_rental.Models;

public partial class Car
{
    public int Id { get; set; }

    public int OwnerId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string? CarType { get; set; }

    public string? Brand { get; set; }

    public string? Model { get; set; }

    public int? Year { get; set; }

    public string? Transmission { get; set; }

    public string? Location { get; set; }

    public decimal? RentalPrice { get; set; }

    public string? PostStatus { get; set; }
    public string AvailabilityCalendar { get; set; } = string.Empty;
    public string RentalStatus { get; set; } = "Available"; 

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual ICollection<CarImage> CarImages { get; set; } = new List<CarImage>();

    public virtual User Owner { get; set; } = null!;

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
