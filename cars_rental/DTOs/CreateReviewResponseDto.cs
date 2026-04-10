namespace cars_rental.DTOs
{
	public class ReviewResponseDto
	{
		public int Id { get; set; }
		public int Rating { get; set; }
		public string Comment { get; set; }
		public string RenterName { get; set; }
	}
}