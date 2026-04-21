import { useEffect, useState } from 'react';
import { bookingApi } from '../../services/bookingApi';
import type { BookingResponse } from '../../types';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const BookingRequestsPage = () => {
  const [requests, setRequests] = useState<BookingResponse[]>([]);
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
      setError(err.response?.data?.message || 'Failed to load rental requests. The endpoint may not exist yet.');
      setRequests([]);
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
      fetchRequests();
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
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h2>Rental Requests</h2>
      {error && <ErrorAlert message={error} />}
      {requests.length === 0 && !error ? (
        <p>No pending requests.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Car</th>
              <th>Renter</th>
              <th>Dates</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.car?.title}</td>
                <td>Renter #{req.renterId}</td>
                <td>{req.startDate} - {req.endDate}</td>
                <td>{req.status}</td>
                <td>
                  {req.status === 'Pending' && (
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
                  {req.status === 'Accepted' && (
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