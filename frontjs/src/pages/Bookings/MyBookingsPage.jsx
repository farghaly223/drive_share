import { useEffect, useState } from 'react';
import { bookingApi } from '../../services/bookingApi';
import { reviewApi } from '../../services/reviewApi';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';
import { getErrorMessage } from '../../utils/helpers';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchBookings = async () => {
    try { setLoading(true); setError(''); const res = await bookingApi.getMyBookings(); setBookings(res.data); } catch (err) { setError(getErrorMessage(err)); } finally { setLoading(false); }
  };
  useEffect(() => { fetchBookings(); }, []);

  const handleReviewSubmit = async (bookingId, carId) => {
    if (!carId) { alert('Car ID missing'); return; }
    if (!reviewForm.comment.trim()) { alert('Write a comment'); return; }
    setSubmitting(bookingId);
    try { await reviewApi.create({ bookingId, carId, rating: reviewForm.rating, comment: reviewForm.comment }); setSuccessMsg('Review submitted!'); await fetchBookings(); } catch (err) { alert(getErrorMessage(err)); } finally { setSubmitting(null); }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;
  return (
    <div>
      <h2>My Bookings</h2>
      {successMsg && <div className="success-message">{successMsg}</div>}
      {bookings.length === 0 ? <p>No bookings.</p> : (
        <table>
          <thead><tr><th>ID</th><th>Car</th><th>Status</th><th>Price</th><th>Review</th></tr></thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}><td>{b.id}</td><td>{b.carTitle}</td><td style={{ textTransform: 'capitalize' }}>{b.status}</td><td>${b.totalPrice}</td>
                <td>
                  {b.status.toLowerCase() === 'completed' && (
                    <div className="review-form-inline">
                      <select value={reviewForm.rating} onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })} disabled={submitting === b.id}>
                        {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} star{r>1?'s':''}</option>)}
                      </select>
                      <input type="text" placeholder="Comment" value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} disabled={submitting === b.id} />
                      <button onClick={() => handleReviewSubmit(b.id, b.carId || 0)} disabled={submitting === b.id}>{submitting === b.id ? 'Sending...' : 'Submit'}</button>
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