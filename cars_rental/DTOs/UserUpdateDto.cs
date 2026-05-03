using System;

namespace cars_rental.DTOs
{
    public class UserUpdateDto
    {
        public int UserId { get; set; }

        // صلاحيات الـ Owner
        public bool? CanPostCars { get; set; }

        // صلاحيات الـ Renter
        public bool? CanRequestBooking { get; set; }

        // حظر شامل من النظام
        public bool? IsBanned { get; set; }

        // حالة الحساب
        public string? AccountStatus { get; set; }
    }
}