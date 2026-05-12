import { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const PendingLicensesList = () => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);

  const fetchLicenses = async () => {
    try { setLoading(true); const res = await adminApi.getPendingLicenses(); setLicenses(res.data); } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchLicenses(); }, []);

  const handleAction = async (id, approve) => {
    setProcessing(id);
    try { await adminApi.verifyLicense(id, approve); await fetchLicenses(); } catch (err) { setError(err.message); } finally { setProcessing(null); }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;
  return (
    <div>
      <h2>Pending License Verifications</h2>
      {licenses.length === 0 ? <p>No pending licenses.</p> : (
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>License URL</th><th>Submitted</th><th>Actions</th></tr></thead>
          <tbody>
            {licenses.map(l => (
              <tr key={l.id}><td>{l.id}</td><td>{l.name}</td><td>{l.email}</td><td><a href={l.driverLicenseUrl} target="_blank" rel="noreferrer">View</a></td><td>{new Date(l.createdAt).toLocaleDateString()}</td>
                <td><button onClick={() => handleAction(l.id, true)} disabled={processing === l.id} className="approve-btn">Approve</button><button onClick={() => handleAction(l.id, false)} disabled={processing === l.id} className="reject-btn">Reject</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default PendingLicensesList;