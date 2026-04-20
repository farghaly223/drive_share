import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carsAPI, bookingAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './CarDetails.css';

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ startDate: '', endDate: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => { fetchCar(); }, [id]);

  const fetchCar = async () => {
    try {
      setLoading(true);
      const res = await carsAPI.getCarById(id);
      // Backend: BrowsingController returns Ok(CarListingDTO) directly
      setCar(res.data);
    } catch {
      setMessage({ text: 'Failed to load car details', type: 'error' });
    } finally { setLoading(false); }
  };

  const calcTotal = () => {
    if (!booking.startDate || !booking.endDate || !car?.rentalPrice) return null;
    const days = Math.round((new Date(booking.endDate) - new Date(booking.startDate)) / 86400000);
    return days > 0 ? { days, total: days * car.rentalPrice } : null;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!booking.startDate || !booking.endDate) { setMessage({ text: 'Please select both dates', type: 'error' }); return; }
    const calc = calcTotal();
    if (!calc || calc.days <= 0) { setMessage({ text: 'End date must be after start date', type: 'error' }); return; }

    try {
      setBookingLoading(true);
      // Backend BookingDto: carId, startDate (DateOnly), endDate (DateOnly)
      await bookingAPI.requestRental({ carId: car.id, startDate: booking.startDate, endDate: booking.endDate });
      setMessage({ text: '✅ Booking request sent! Redirecting…', type: 'success' });
      setBooking({ startDate: '', endDate: '' });
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      const msg = err.response?.data || err.response?.data?.message || 'Booking failed';
      setMessage({ text: typeof msg === 'string' ? msg : 'Booking failed', type: 'error' });
    } finally { setBookingLoading(false); }
  };

  if (loading) return <div className="page-loading"><span className="spinner" /> Loading…</div>;
  if (!car) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <h2 style={{ fontFamily: 'var(--font-head)', marginBottom: 16 }}>Car not found</h2>
      <button className="btn btn-primary" onClick={() => navigate('/browse')}>← Back to Browse</button>
    </div>
  );

  const calc = calcTotal();

  return (
    <div className="car-details-page">
      <button className="btn btn-secondary btn-sm" style={{ marginBottom: 24 }} onClick={() => navigate('/browse')}>
        ← Back to Browse
      </button>

      <div className="car-details-grid">
        {/* Gallery */}
        <div className="car-gallery-side">
          {car.mainImageUrl && car.mainImageUrl !== 'default_car.png'
            ? <img src={car.mainImageUrl} alt={car.title} className="car-main-img" />
            : <div className="car-no-img-lg">🚗</div>
          }
        </div>

        {/* Info */}
        <div className="car-info-side">
          <div className="car-detail-header ds-card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 12 }}>
              <h1>{car.title || `${car.brand} ${car.model}`}</h1>
              <span className={`badge badge-${car.rentalStatus?.toLowerCase() === 'rented' ? 'rented' : 'available'}`}>
                {car.rentalStatus || 'Available'}
              </span>
            </div>
            <div className="car-meta">{[car.brand, car.model, car.year].filter(Boolean).join(' · ')}</div>
            {car.ownerName && <div className="car-meta">Listed by <strong style={{color:'var(--text)'}}>{car.ownerName}</strong></div>}
            <div className="car-detail-price">${car.rentalPrice} <span>/day</span></div>
          </div>

          <div className="ds-card">
            <div className="specs-grid">
              {[
                ['Car Type', car.carType || '—'],
                ['Transmission', car.transmission || '—'],
                ['Year', car.year || '—'],
                ['Location', car.location || '—'],
                ['Brand', car.brand || '—'],
                ['Model', car.model || '—'],
              ].map(([label, value]) => (
                <div className="spec-item" key={label}>
                  <div className="spec-label">{label}</div>
                  <div className="spec-value">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {car.description && (
            <div className="ds-card desc-section">
              <h3>About this car</h3>
              <p>{car.description}</p>
            </div>
          )}

          {/* Booking Panel */}
          <div className="booking-card">
            <h3>📅 Request a Booking</h3>

            {message.text && (
              <div className={`alert alert-${message.type === 'error' ? 'error' : 'success'}`}>{message.text}</div>
            )}

            {!token ? (
              <div className="login-cta">
                <p>Sign in to make a booking request</p>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>Sign In</button>
              </div>
            ) : user?.role !== 'renter' ? (
              <div className="role-info">
                ℹ️ Only renters can make booking requests. Your account is registered as <strong>{user.role}</strong>.
              </div>
            ) : (
              <form className="booking-form-inner" onSubmit={handleBooking}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input type="date" value={booking.startDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setBooking(p => ({ ...p, startDate: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input type="date" value={booking.endDate}
                      min={booking.startDate || new Date().toISOString().split('T')[0]}
                      onChange={e => setBooking(p => ({ ...p, endDate: e.target.value }))} required />
                  </div>
                </div>
                {calc && (
                  <div className="total-preview">
                    <span className="label">{calc.days} day{calc.days > 1 ? 's' : ''} × ${car.rentalPrice}</span>
                    <span className="amount">${calc.total}</span>
                  </div>
                )}
                <button type="submit" className="btn btn-primary" disabled={bookingLoading}>
                  {bookingLoading ? <><span className="spinner" /> Sending…</> : 'Request Booking'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
