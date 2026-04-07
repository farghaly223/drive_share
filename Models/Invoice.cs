using System;
using System.Collections.Generic;

namespace cars_rental.Models;

public partial class Invoice
{
    public long Id { get; set; }

    public long? AppointmentId { get; set; }

    public double? TotalAmount { get; set; }

    public string? PaymentStatus { get; set; }
}
