import { useEffect, useState } from 'react';
import { bookingApi } from '../../services/bookingApi';
import type { BookingResponse } from '../../types';
import Loading from '../../components/common/Loading';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingApi.getMyBookings()
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusClass = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'accepted') return 'status-accepted';
    if (s === 'pending') return 'status-pending';
    if (s === 'rejected') return 'status-rejected';
    if (s === 'completed') return 'status-completed';
    return 'status-pending';
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header">
        <h2>My Bookings</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{bookings.length} total</span>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>No bookings yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Car</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td><strong>{b.car?.title}</strong><br /><span style={{ fontSize: '0.8rem' }}>{b.car?.brand}</span></td>
                  <td>{b.startDate}</td>
                  <td>{b.endDate}</td>
                  <td><span className={`status-badge ${getStatusClass(b.status)}`}>{b.status}</span></td>
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
