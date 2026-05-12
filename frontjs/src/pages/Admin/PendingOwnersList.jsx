import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';
import { getErrorMessage } from '../../utils/helpers';

const PendingOwnersList = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);

  const fetchPending = async () => {
    try { setLoading(true); const res = await adminApi.getPendingOwners(); setOwners(res.data); } catch (err) { setError(getErrorMessage(err)); } finally { setLoading(false); }
  };
  useEffect(() => { fetchPending(); }, []);

  const handleAction = async (id, approve) => {
    setProcessing(id);
    try { await adminApi.manageOwner(id, approve); await fetchPending(); } catch (err) { setError(getErrorMessage(err)); }
    finally { setProcessing(null); }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;
  return (
    <div>
      <h2>Pending Car Owner Approvals</h2>
      {owners.length === 0 ? <p>No pending owners.</p> : (
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Registered</th><th>Actions</th></tr></thead>
          <tbody>
            {owners.map(o => (
              <tr key={o.id}><td>{o.name}</td><td>{o.email}</td><td>{new Date(o.registrationDate).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleAction(o.id, true)} disabled={processing === o.id} className="approve-btn">Approve</button>
                  <button onClick={() => handleAction(o.id, false)} disabled={processing === o.id} className="reject-btn">Reject</button>
                  <Link to={`/admin/manage-owner/${o.id}`} style={{ marginLeft: '0.5rem' }}>Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default PendingOwnersList;