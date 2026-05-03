namespace cars_rental.DTOs
{
    // Admin sends this to control exactly what a user can or cannot do
    public class UpdatePermissionsDto
    {
        public bool? IsSuspended { get; set; }    // null = don't touch, true/false = set it
        public bool? CanAddCars { get; set; }     // null = don't touch, true/false = set it
        public bool? CanRentCars { get; set; }    // null = don't touch, true/false = set it
    }
}