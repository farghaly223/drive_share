import { useEffect, useState } from 'react';
import { bookingApi } from '../../services/bookingApi';
import type { OwnerBookingRequestDTO } from '../../types';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const BookingRequestsPage = () => {
  const [requests, setRequests] = useState<OwnerBookingRequestDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState<number | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await bookingApi.getOwnerRequests();
      setRequests(res.data);
    } catch (err: any) {
      console.error('Failed to fetch owner requests:', err);
      setError(err.response?.data?.message || 'Failed to load rental requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRespond = async (id: number, accept: boolean) => {
    setProcessing(id);
    try {
      await bookingApi.respond(id, accept);
      await fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setProcessing(null);
    }
  };

  const handleComplete = async (id: number) => {
    setProcessing(id);
    try {
      await bookingApi.complete(id);
      await fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      <h2>Rental Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Car</th>
              <th>Status</th>
              <th>Total Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.carTitle}</td>
                <td style={{ textTransform: 'capitalize' }}>{req.status}</td>
                <td>${req.totalPrice}</td>
                <td>
                  {req.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleRespond(req.id, true)}
                        disabled={processing === req.id}
                        className="approve-btn"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(req.id, false)}
                        disabled={processing === req.id}
                        className="reject-btn"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {req.status === 'accepted' && (
                    <button
                      onClick={() => handleComplete(req.id)}
                      disabled={processing === req.id}
                    >
                      Mark Completed
                    </button>
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

export default BookingRequestsPage;