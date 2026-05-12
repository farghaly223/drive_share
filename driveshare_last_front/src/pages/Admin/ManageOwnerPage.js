import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const ManageOwnerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const res = await adminApi.getPendingOwners();
        const found = res.data.find((o) => o.id === Number(id));
        if (found) {
          setOwner(found);
        } else {
          setOwner({
            id: Number(id),
            name: `Owner ${id}`,
            email: `owner${id}@example.com`,
            registrationDate: new Date().toISOString(),
            status: 'Pending',
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load owner details');
      } finally {
        setLoading(false);
      }
    };
    fetchOwner();
  }, [id]);

  const handleAction = async (approve) => {
    if (!owner) return;
    setProcessing(true);
    setError('');
    setMessage('');
    try {
      await adminApi.manageOwner(owner.id, approve);
      setMessage(`Owner ${approve ? 'approved' : 'rejected'} successfully.`);
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Loading />;
  if (!owner && error) return <ErrorAlert message={error} />;
  if (!owner) return <p>Owner not found</p>;

  return (
    <div className="form-page">
      <div className="page-header">
        <button onClick={() => navigate('/admin/dashboard')} className="back-link">
          ← Back to Dashboard
        </button>
        <h2>Manage Car Owner</h2>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}
      {message && <div className="success-message">{message}</div>}

      <div className="form-card">
        <h3>Owner Information</h3>
        <div className="profile-row">
          <span className="profile-label">Name</span>
          <span>{owner.name}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Email</span>
          <span>{owner.email}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Registered</span>
          <span>{new Date(owner.registrationDate).toLocaleDateString()}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Status</span>
          <span className={`status-badge status-${owner.status?.toLowerCase()}`}>
            {owner.status}
          </span>
        </div>

        {owner.status === 'Pending' && (
          <div className="actions" style={{ marginTop: '1.5rem' }}>
            <button
              onClick={() => handleAction(true)}
              disabled={processing}
              className="approve-btn"
            >
              {processing ? 'Processing...' : 'Approve Owner'}
            </button>
            <button
              onClick={() => handleAction(false)}
              disabled={processing}
              className="reject-btn"
            >
              {processing ? 'Processing...' : 'Reject Owner'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOwnerPage;
