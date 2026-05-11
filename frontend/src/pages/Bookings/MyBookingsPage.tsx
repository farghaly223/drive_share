import { useEffect, useState } from 'react';
import { bookingApi } from '../../services/bookingApi';
import { reviewApi } from '../../services/reviewApi';
import type { MyBookingDTO, ReviewCreateDto } from '../../types';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';
import { getErrorMessage } from '../../utils/helpers';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<MyBookingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Review form state (per booking)
  const [reviewForm, setReviewForm] = useState<{
    bookingId: number;
    carId: number;
    rating: number;
    comment: string;
  }>({ bookingId: 0, carId: 0, rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState<number | null>(null); // bookingId being submitted
  const [successMsg, setSuccessMsg] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await bookingApi.getMyBookings();
      // Ensure carId is present; if not, we cannot submit reviews reliably
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

  const handleReviewSubmit = async (bookingId: number, carId: number) => {
    if (!carId) {
      alert('Car ID missing – cannot submit review.');
      return;
    }
    if (!reviewForm.comment.trim()) {
      alert('Please write a comment.');
      return;
    }
    setSubmitting(bookingId);
    try {
      const payload: ReviewCreateDto = {
        bookingId,
        carId,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      };
      await reviewApi.create(payload);
      setSuccessMsg('Review submitted!');
      // Optionally refetch bookings or update local status to hide the form
      await fetchBookings();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      <h2>My Bookings</h2>
      {successMsg && <div className="success-message">{successMsg}</div>}
      {bookings.length === 0 ? (
        <p>You haven't made any bookings yet.</p>
      ) : (
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
                <td>{booking.id}</td>
                <td>{booking.carTitle}</td>
                <td style={{ textTransform: 'capitalize' }}>{booking.status}</td>
                <td>${booking.totalPrice}</td>
                <td>
                  {booking.status.toLowerCase() === 'completed' && (
                    <div className="review-form-inline">
                      <select
                        value={reviewForm.rating}
                        onChange={(e) =>
                          setReviewForm({ ...reviewForm, rating: Number(e.target.value) })
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
                        value={reviewForm.comment}
                        onChange={(e) =>
                          setReviewForm({ ...reviewForm, comment: e.target.value })
                        }
                        style={{ marginLeft: '0.5rem', width: '150px' }}
                        disabled={submitting === booking.id}
                      />
                      <button
                        onClick={() => {
                          setReviewForm((prev) => ({
                            ...prev,
                            bookingId: booking.id,
                            carId: booking.carId || 0,
                          }));
                          handleReviewSubmit(booking.id, booking.carId || 0);
                        }}
                        disabled={submitting === booking.id}
                        style={{ marginLeft: '0.5rem' }}
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
      )}
    </div>
  );
};

export default MyBookingsPage;