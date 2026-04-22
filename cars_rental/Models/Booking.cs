using System;
using System.Collections.Generic;

namespace cars_rental.Models;

public partial class Booking
{
    public int Id { get; set; }

    public int CarId { get; set; }

    public int RenterId { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }
    
    public decimal TotalPrice { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Car Car { get; set; } = null!;

    public virtual User Renter { get; set; } = null!;

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
