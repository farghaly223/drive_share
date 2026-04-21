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
        <h2>Rental Requests</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{requests.length} requests</span>
      </div>

      {error && <ErrorAlert message={error} />}

      {requests.length === 0 && !error ? (
        <div className="empty-state">
          <p>No pending requests.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Car</th>
                <th>Renter</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td><strong>{req.car?.title}</strong></td>
                  <td>Renter #{req.renterId}</td>
                  <td>{req.startDate}</td>
                  <td>{req.endDate}</td>
                  <td><span className={`status-badge ${getStatusClass(req.status)}`}>{req.status}</span></td>
                  <td>
                    <div className="actions">
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
                          style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.25)' }}
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
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

export default BookingRequestsPage;
