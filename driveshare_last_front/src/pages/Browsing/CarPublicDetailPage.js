import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { browsingApi } from '../../services/browsingApi';
import { bookingApi } from '../../services/bookingApi';
import { reviewApi } from '../../services/reviewApi';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';
import { getErrorMessage } from '../../utils/helpers';

const CarPublicDetailPage = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState({ carId: Number(id), startDate: '', endDate: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  const { isAuthenticated, isRenter, canRentCars } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    browsingApi
      .getById(Number(id))
      .then((res) => setCar(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));

    reviewApi
      .getByCar(Number(id))
      .then((res) => setReviews(res.data))
      .catch((err) => console.error('Could not load reviews', err));
  }, [id]);

  const handleBookingSubmit = async (e) => {
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
      setBookingSuccess('Booking request sent! The owner will respond shortly.');
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
      <div className="car-detail-header">
        <Link to="/browse" className="back-link">
          ← Back to Browse
        </Link>
        <h2>{car.title}</h2>
      </div>

      <div className="car-detail-grid">
        <div className="car-detail-image">
          <img src={car.mainImageUrl || '/placeholder-car.jpg'} alt={car.title} />
          <span className={`status-badge status-${car.rentalStatus?.toLowerCase()}`}>
            {car.rentalStatus}
          </span>
        </div>

        <div className="car-detail-info">
          <div className="info-group">
            <p>
              <strong>Owner:</strong> {car.ownerName}
            </p>
            <p>
              <strong>Description:</strong> {car.description}
            </p>
            <p>
              <strong>Type:</strong> {car.carType}
            </p>
            <p>
              <strong>Brand / Model:</strong> {car.brand} {car.model} ({car.year})
            </p>
            <p>
              <strong>Transmission:</strong> {car.transmission}
            </p>
            <p>
              <strong>Location:</strong> {car.location}
            </p>
            <div className="price-tag large">
              ${car.rentalPrice}
              <span>/day</span>
            </div>
          </div>

          {/* Booking section — only for authenticated renters with permission */}
          {isRenter && canBook && canRentCars && (
            <div className="booking-form">
              <h3>Request Rental</h3>
              {bookingSuccess && <div className="success-message">{bookingSuccess}</div>}
              <form onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={booking.startDate}
                    onChange={(e) => setBooking({ ...booking, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={booking.endDate}
                    onChange={(e) => setBooking({ ...booking, endDate: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" disabled={bookingLoading} className="btn-primary">
                  {bookingLoading ? 'Sending...' : 'Request Booking'}
                </button>
              </form>
              {bookingError && (
                <ErrorAlert message={bookingError} onDismiss={() => setBookingError('')} />
              )}
            </div>
          )}

          {/* Soft permission warning */}
          {isRenter && !canRentCars && (
            <div className="warning-box">
              You do not have permission to rent cars. Please contact the admin.
            </div>
          )}

          {/* CTA for guests */}
          {!isAuthenticated && (
            <p className="login-prompt">
              <Link to="/login">Login</Link> to book this car.
            </p>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="reviews-section">
        <h3>Reviews ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul className="review-list">
            {reviews.map((review) => (
              <li key={review.id} className="review-item">
                <div className="review-rating">
                  {'⭐'.repeat(review.rating)}{' '}
                  <span>({review.rating}/5)</span>
                </div>
                <p className="review-comment">{review.comment}</p>
                <small className="review-meta">
                  By renter #{review.renterId} · Booking #{review.bookingId}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CarPublicDetailPage;
