import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import type { PendingOwner } from '../../types';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const PendingOwnersList = () => {
  const [owners, setOwners] = useState<PendingOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState<number | null>(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getPendingOwners();
      setOwners(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch pending owners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id: number, approve: boolean) => {
    setProcessing(id);
    try {
      await adminApi.manageOwner(id, approve);
      await fetchPending();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      <h2>Pending Car Owner Approvals</h2>
      {owners.length === 0 ? (
        <p>No pending owners.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {owners.map((owner) => (
              <tr key={owner.id}>
                <td>{owner.name}</td>
                <td>{owner.email}</td>
                <td>{new Date(owner.registrationDate).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleAction(owner.id, true)}
                    disabled={processing === owner.id}
                    className="approve-btn"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(owner.id, false)}
                    disabled={processing === owner.id}
                    className="reject-btn"
                  >
                    Reject
                  </button>
                  <Link to={`/admin/manage-owner/${owner.id}`} style={{ marginLeft: '0.5rem' }}>
                    Details
                  </Link>
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