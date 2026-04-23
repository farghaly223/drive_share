import { useEffect, useState } from 'react';
import { bookingApi } from '../../services/bookingApi';
import type { MyBookingDTO } from '../../types';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<MyBookingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await bookingApi.getMyBookings();
        setBookings(res.data);
      } catch (err: any) {
        console.error('Failed to fetch my bookings:', err);
        setError(err.response?.data?.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      <h2>My Bookings</h2>
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
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.carTitle}</td>
                <td style={{ textTransform: 'capitalize' }}>{booking.status}</td>
                <td>${booking.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyBookingsPage;