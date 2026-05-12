import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { browsingApi } from '../../services/browsingApi';
import { bookingApi } from '../../services/bookingApi';
import { reviewApi } from '../../services/reviewApi';  // ✅ new
import { useAuth } from '../../hooks/useAuth';
import type { CarListingDTO, BookingDto, Review } from '../../types';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';
import { getErrorMessage } from '../../utils/helpers';

const CarPublicDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<CarListingDTO | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);   // ✅ new state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState<BookingDto>({
    carId: Number(id),
    startDate: '',
    endDate: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const { isAuthenticated, isRenter, canRentCars } = useAuth();
  const navigate = useNavigate();

  // Fetch car and its reviews
  useEffect(() => {
    browsingApi
      .getById(Number(id))
      .then((res) => setCar(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));

    // Fetch reviews independently
    reviewApi
      .getByCar(Number(id))
      .then((res) => setReviews(res.data))
      .catch((err) => console.error('Could not load reviews', err));
  }, [id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!canRentCars) {
      setBookingError("You don't have permission to rent cars. Please contact the admin.");
      return;
    }

    setBookingError('');
    setBookingLoading(true);
    try {
      await bookingApi.request(booking);
      alert('Booking request sent!');
      setBooking({ carId: Number(id), startDate: '', endDate: '' });
    } catch (err) {
      setBookingError(getErrorMessage(err));
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;
  if (!car) return <p>Car not found</p>;

  const canBook =
    car.rentalStatus?.toLowerCase() !== 'pending' &&
    car.rentalStatus?.toLowerCase() !== 'rejected';

  return (
    <div className="car-detail">
      <h2>{car.title}</h2>
      <img
        src={car.mainImageUrl || '/placeholder-car.jpg'}
        alt={car.title}
        style={{ maxWidth: '400px' }}
      />
      <p><strong>Owner:</strong> {car.ownerName}</p>
      <p><strong>Description:</strong> {car.description}</p>
      <p><strong>Type:</strong> {car.carType}</p>
      <p><strong>Brand/Model:</strong> {car.brand} {car.model} ({car.year})</p>
      <p><strong>Transmission:</strong> {car.transmission}</p>
      <p><strong>Location:</strong> {car.location}</p>
      <p><strong>Price per day:</strong> ${car.rentalPrice}</p>
      <p><strong>Status:</strong> {car.rentalStatus}</p>

      {/* Booking section */}
      {isRenter && canBook && canRentCars && (
        <div className="booking-form">
          <h3>Request Rental</h3>
          <form onSubmit={handleBookingSubmit}>
            <div>
              <label>Start Date</label>
              <input
                type="date"
                value={booking.startDate}
                onChange={(e) => setBooking({ ...booking, startDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label>End Date</label>
              <input
                type="date"
                value={booking.endDate}
                onChange={(e) => setBooking({ ...booking, endDate: e.target.value })}
                required
              />
            </div>
            <button type="submit" disabled={bookingLoading}>
              {bookingLoading ? 'Sending...' : 'Request Booking'}
            </button>
          </form>
          {bookingError && <ErrorAlert message={bookingError} onDismiss={() => setBookingError('')} />}
        </div>
      )}

      {isRenter && !canRentCars && (
        <p style={{ color: '#856404', backgroundColor: '#fff3cd', padding: '0.75rem', borderRadius: '4px', marginTop: '1rem' }}>
          You do not have permission to rent cars. Please contact the admin.
        </p>
      )}

      {!isAuthenticated && (
        <p>
          <Link to="/login">Login</Link> to book this car.
        </p>
      )}

      {/* ✅ Reviews section */}
      <div className="reviews-section" style={{ marginTop: '2rem' }}>
        <h3>Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul className="review-list" style={{ listStyle: 'none', padding: 0 }}>
            {reviews.map((review) => (
              <li key={review.id} className="review-item" style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                <div>
                  <strong>Rating:</strong> {'⭐'.repeat(review.rating)} ({review.rating}/5)
                </div>
                <p>{review.comment}</p>
                <small style={{ color: '#888' }}>By renter #{review.renterId} (Booking #{review.bookingId})</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CarPublicDetailPage;