using System;
using System.Collections.Generic;

namespace cars_rental.Models;

public partial class CarImage
{
    public int Id { get; set; }

    public int CarId { get; set; }

    public string ImageUrl { get; set; } = null!;

    public bool? IsMain { get; set; }

    public virtual Car Car { get; set; } = null!;
}
