import React, { useEffect, useState } from 'react';
import { bookingApi } from '../../services/bookingApi';
import { reviewApi } from '../../services/reviewApi';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';
import { getErrorMessage } from '../../utils/helpers';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewForms, setReviewForms] = useState({}); // keyed by bookingId
  const [submitting, setSubmitting] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await bookingApi.getMyBookings();
      setBookings(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getReviewForm = (bookingId) =>
    reviewForms[bookingId] || { rating: 5, comment: '' };

  const setReviewField = (bookingId, field, value) => {
    setReviewForms((prev) => ({
      ...prev,
      [bookingId]: { ...getReviewForm(bookingId), [field]: value },
    }));
  };

  const handleReviewSubmit = async (bookingId, carId) => {
    if (!carId) {
      alert('Car ID missing – cannot submit review.');
      return;
    }
    const form = getReviewForm(bookingId);
    if (!form.comment.trim()) {
      alert('Please write a comment.');
      return;
    }
    setSubmitting(bookingId);
    try {
      await reviewApi.create({
        bookingId,
        carId,
        rating: form.rating,
        comment: form.comment,
      });
      setSuccessMsg('Review submitted!');
      await fetchBookings();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSubmitting(null);
    }
  };

  const getStatusClass = (status) => {
    const s = status?.toLowerCase();
    if (s === 'completed') return 'status-available';
    if (s === 'accepted') return 'status-rented';
    if (s === 'pending') return 'status-pending';
    return 'status-pending';
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      <div className="page-header">
        <h2>My Bookings</h2>
      </div>

      {successMsg && <div className="success-message">{successMsg}</div>}

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>You haven't made any bookings yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Car</th>
                <th>Status</th>
                <th>Total Price</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>#{booking.id}</td>
                  <td>{booking.carTitle}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>${booking.totalPrice}</td>
                  <td>
                    {booking.status?.toLowerCase() === 'completed' && (
                      <div className="review-form-inline">
                        <select
                          value={getReviewForm(booking.id).rating}
                          onChange={(e) =>
                            setReviewField(booking.id, 'rating', Number(e.target.value))
                          }
                          disabled={submitting === booking.id}
                        >
                          {[5, 4, 3, 2, 1].map((r) => (
                            <option key={r} value={r}>
                              {r} star{r > 1 ? 's' : ''}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Comment (required)"
                          value={getReviewForm(booking.id).comment}
                          onChange={(e) =>
                            setReviewField(booking.id, 'comment', e.target.value)
                          }
                          disabled={submitting === booking.id}
                        />
                        <button
                          onClick={() => handleReviewSubmit(booking.id, booking.carId || 0)}
                          disabled={submitting === booking.id}
                          className="btn-small"
                        >
                          {submitting === booking.id ? 'Sending...' : 'Submit'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
