import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { bookingAPI } from '../services/api';
import './MyBookings.css';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    fetchBookings();
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingAPI.getMyBookings();
      const data = Array.isArray(res.data) ? res.data : (res.data?.value ?? []);
      setBookings(data);
    } catch (err) {
      // 404 just means no bookings yet — treat as empty
      if (err.response?.status !== 404) {
        setMsg({ text: 'Could not load bookings.', type: 'error' });
      }
    } finally { setLoading(false); }
  };

  const handleRespond = async (bookingId, accept) => {
    try {
      await bookingAPI.respondToBooking(bookingId, accept);
      setMsg({ text: `Booking ${accept ? 'accepted' : 'rejected'} successfully.`, type: 'success' });
      fetchBookings();
    } catch {
      setMsg({ text: 'Action failed. Please try again.', type: 'error' });
    }
  };

  const handleComplete = async (bookingId) => {
    try {
      await bookingAPI.completeBooking(bookingId);
      setMsg({ text: 'Rental marked as completed.', type: 'success' });
      fetchBookings();
    } catch {
      setMsg({ text: 'Could not complete booking.', type: 'error' });
    }
  };

  if (!isAuthenticated) return null;

  const statusClass = (s) => {
    const map = { pending: 'pending', accepted: 'accepted', rejected: 'rejected', completed: 'completed' };
    return `badge-${map[s?.toLowerCase()] || 'pending'}`;
  };

  const formatDate = (d) => {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
  };

  return (
    <div className="my-bookings-page">
      <h1 className="section-title">{user?.role === 'owner' ? 'Rental Requests' : 'My Bookings'}</h1>
      <p className="section-sub">
        {user?.role === 'owner'
          ? 'Accept or reject rental requests for your cars'
          : 'Track your rental requests and history'}
      </p>

      {msg.text && <div className={`alert alert-${msg.type === 'error' ? 'error' : 'success'}`}>{msg.text}</div>}

      {loading ? (
        <div className="page-loading"><span className="spinner" /> Loading bookings…</div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <h3>No bookings yet</h3>
          <p>{user?.role === 'owner' ? 'Rental requests will appear here once renters book your cars.' : "You haven't made any booking requests yet."}</p>
          {user?.role === 'renter' && <button className="btn btn-primary" onClick={() => navigate('/browse')}>Browse Cars</button>}
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(b => (
            <div key={b.id} className="booking-card">
              <div className="booking-main">
                <h3>{b.carTitle || `Car #${b.carId}`}</h3>
                <div className="booking-meta">
                  <span>📅 {formatDate(b.startDate)} → {formatDate(b.endDate)}</span>
                  {b.renterName && user?.role === 'owner' && <span>👤 {b.renterName}</span>}
                  {b.carOwnerName && user?.role === 'renter' && <span>🏎️ Owner: {b.carOwnerName}</span>}
                </div>
              </div>
              <div className="booking-side">
                {b.totalPrice && <div className="booking-total">${b.totalPrice}</div>}
                <span className={`badge ${statusClass(b.status)}`}>{b.status}</span>

                {/* Owner actions on pending bookings */}
                {user?.role === 'owner' && b.status?.toLowerCase() === 'pending' && (
                  <div className="booking-actions">
                    <button className="btn btn-success btn-sm" onClick={() => handleRespond(b.id, true)}>✓ Accept</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRespond(b.id, false)}>✗ Reject</button>
                  </div>
                )}
                {/* Owner can mark accepted bookings as complete */}
                {user?.role === 'owner' && b.status?.toLowerCase() === 'accepted' && (
                  <button className="btn btn-secondary btn-sm" onClick={() => handleComplete(b.id)}>Mark Complete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
