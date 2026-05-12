import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const PendingOwnersList = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getPendingOwners();
      setOwners(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending owners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id, approve) => {
    setProcessing(id);
    try {
      await adminApi.manageOwner(id, approve);
      await fetchPending();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h2>Pending Car Owner Approvals</h2>
        <span className="text-muted">{owners.length} pending</span>
      </div>

      {owners.length === 0 ? (
        <div className="empty-state">
          <p>No pending owners. You're all caught up!</p>
        </div>
      ) : (
        <div className="table-container">
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
                  <td>
                    <strong>{owner.name}</strong>
                  </td>
                  <td>{owner.email}</td>
                  <td>{new Date(owner.registrationDate).toLocaleDateString()}</td>
                  <td>
                    <div className="actions">
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
                      <Link
                        to={`/admin/manage-owner/${owner.id}`}
                        className="details-link"
                      >
                        Details →
                      </Link>
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

export default PendingOwnersList;
