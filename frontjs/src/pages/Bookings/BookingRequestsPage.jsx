import { useEffect, useState } from 'react';
import { bookingApi } from '../../services/bookingApi';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const BookingRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);

  const fetchRequests = async () => {
    try { setLoading(true); const res = await bookingApi.getOwnerRequests(); setRequests(res.data); } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchRequests(); }, []);

  const handleRespond = async (id, accept) => { setProcessing(id); try { await bookingApi.respond(id, accept); fetchRequests(); } catch (err) { alert(err.message); } finally { setProcessing(null); } };
  const handleComplete = async (id) => { setProcessing(id); try { await bookingApi.complete(id); fetchRequests(); } catch (err) { alert(err.message); } finally { setProcessing(null); } };

  if (loading) return <Loading />;
  return (
    <div>
      <h2>Rental Requests</h2>
      {error && <ErrorAlert message={error} />}
      {requests.length === 0 ? <p>No pending requests.</p> : (
        <table>
          <thead><tr><th>ID</th><th>Car</th><th>Status</th><th>Price</th><th>Actions</th></tr></thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}><td>{req.id}</td><td>{req.carTitle}</td><td style={{ textTransform: 'capitalize' }}>{req.status}</td><td>${req.totalPrice}</td>
                <td>
                  {req.status === 'pending' && <><button onClick={() => handleRespond(req.id, true)} disabled={processing === req.id} className="approve-btn">Accept</button><button onClick={() => handleRespond(req.id, false)} disabled={processing === req.id} className="reject-btn">Reject</button></>}
                  {req.status === 'accepted' && <button onClick={() => handleComplete(req.id)} disabled={processing === req.id}>Mark Completed</button>}
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