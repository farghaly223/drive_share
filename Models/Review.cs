using System;
using System.Collections.Generic;

namespace cars_rental.Models;

public partial class Review
{
    public int Id { get; set; }

    public int BookingId { get; set; }

    public int CarId { get; set; }

    public int RenterId { get; set; }

    public int? Rating { get; set; }

    public string? Comment { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual Car Car { get; set; } = null!;

    public virtual User Renter { get; set; } = null!;
}
