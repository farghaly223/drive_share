import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { browsingApi } from '../../services/browsingApi';
import { bookingApi } from '../../services/bookingApi';
import { useAuth } from '../../hooks/useAuth';
import type { CarListingDTO, BookingDto } from '../../types';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const CarPublicDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<CarListingDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState<BookingDto>({
    carId: Number(id),
    startDate: '',
    endDate: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const { isAuthenticated, isRenter } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    browsingApi.getById(Number(id))
      .then((res) => setCar(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setBookingLoading(true);
    try {
      await bookingApi.request(booking);
      alert('Booking request sent!');
      setBooking({ carId: Number(id), startDate: '', endDate: '' });
    } catch (err: any) {
    const errorMsg = err.response?.data?.message || err.message || 'Booking failed';
    alert(errorMsg);
    } finally {
      setBookingLoading(false);
    } 
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;
  if (!car) return <p>Car not found</p>;

  const statusClass = car.rentalStatus?.toLowerCase() === 'available' ? 'status-available' : 'status-rented';

  return (
    <div className="car-detail">
      <div className="car-detail-header">
        <h2>{car.title}</h2>
        <span className={`status-badge ${statusClass}`}>{car.rentalStatus}</span>
      </div>

      <img
        className="car-detail-image"
        src={car.mainImageUrl || '/placeholder-car.jpg'}
        alt={car.title}
      />

      <div className="car-detail-grid">
        <div className="car-detail-item">
          <div className="label">Owner</div>
          <div className="value">{car.ownerName}</div>
        </div>
        <div className="car-detail-item">
          <div className="label">Car Type</div>
          <div className="value">{car.carType}</div>
        </div>
        <div className="car-detail-item">
          <div className="label">Brand / Model</div>
          <div className="value">{car.brand} {car.model} ({car.year})</div>
        </div>
        <div className="car-detail-item">
          <div className="label">Transmission</div>
          <div className="value">{car.transmission}</div>
        </div>
        <div className="car-detail-item">
          <div className="label">Location</div>
          <div className="value">{car.location}</div>
        </div>
        <div className="car-detail-item">
          <div className="label">Price per day</div>
          <div className="car-detail-price">${car.rentalPrice}<span>/day</span></div>
        </div>
      </div>

      {car.description && (
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>{car.description}</p>
        </div>
      )}

      {isRenter && car.rentalStatus === 'Available' && (
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
              {bookingLoading ? 'Sending request...' : 'Request Booking'}
            </button>
          </form>
        </div>
      )}

      {!isAuthenticated && (
        <div className="booking-form">
          <p style={{ margin: 0 }}>
            <Link to="/login">Login</Link> to book this car.
          </p>
        </div>
      )}
    </div>
  );
};

export default CarPublicDetailPage;
