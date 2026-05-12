import React, { useEffect, useState } from 'react';
import { bookingApi } from '../../services/bookingApi';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const BookingRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await bookingApi.getOwnerRequests();
      setRequests(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load rental requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRespond = async (id, accept) => {
    setProcessing(id);
    try {
      await bookingApi.respond(id, accept);
      await fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setProcessing(null);
    }
  };

  const handleComplete = async (id) => {
    setProcessing(id);
    try {
      await bookingApi.complete(id);
      await fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      <div className="page-header">
        <h2>Rental Requests</h2>
        <span className="text-muted">{requests.length} total</span>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <p>No rental requests yet.</p>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>#{req.id}</td>
                  <td>{req.carTitle}</td>
                  <td style={{ textTransform: 'capitalize' }}>
                    <span className={`status-badge status-${req.status?.toLowerCase()}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>${req.totalPrice}</td>
                  <td>
                    <div className="actions">
                      {req.status?.toLowerCase() === 'pending' && (
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
                      {req.status?.toLowerCase() === 'accepted' && (
                        <button
                          onClick={() => handleComplete(req.id)}
                          disabled={processing === req.id}
                          className="btn-primary btn-small"
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
