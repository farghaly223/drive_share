import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

interface OwnerDetails {
  id: number;
  name: string;
  email: string;
  registrationDate: string;
  status: string;
}

const ManageOwnerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<OwnerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const res = await adminApi.getPendingOwners();
        const found = res.data.find((o: any) => o.id === Number(id));
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
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load owner details');
      } finally {
        setLoading(false);
      }
    };
    fetchOwner();
  }, [id]);

  const handleAction = async (approve: boolean) => {
    if (!owner) return;
    setProcessing(true);
    setError('');
    setMessage('');
    try {
      await adminApi.manageOwner(owner.id, approve);
      setMessage(`Owner ${approve ? 'approved' : 'rejected'} successfully.`);
      setTimeout(() => navigate('/admin/pending-owners'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Loading />;
  if (!owner && error) return <ErrorAlert message={error} />;
  if (!owner) return <p>Owner not found</p>;

  return (
    <div className="manage-owner" style={{ maxWidth: '600px' }}>
      <div className="page-header">
        <h2>Manage Car Owner</h2>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}
      {message && <div className="success-message">{message}</div>}

      <div className="owner-details">
        <h3>Owner Information</h3>
        <p><strong>Name:</strong> {owner.name}</p>
        <p><strong>Email:</strong> {owner.email}</p>
        <p><strong>Registered:</strong> {new Date(owner.registrationDate).toLocaleDateString()}</p>
        <p>
          <strong>Status:</strong>{' '}
          <span className={`status-badge ${owner.status === 'Pending' ? 'status-pending' : owner.status === 'Approved' ? 'status-available' : 'status-rejected'}`}>
            {owner.status}
          </span>
        </p>
      </div>

      {owner.status === 'Pending' && (
        <div className="actions">
          <button
            onClick={() => handleAction(true)}
            disabled={processing}
            className="approve-btn"
            style={{ padding: '0.65rem 1.5rem' }}
          >
            {processing ? 'Processing...' : 'Approve Owner'}
          </button>
          <button
            onClick={() => handleAction(false)}
            disabled={processing}
            className="reject-btn"
            style={{ padding: '0.65rem 1.5rem' }}
          >
            {processing ? 'Processing...' : 'Reject Owner'}
          </button>
        </div>
      )}

      <button onClick={() => navigate('/admin/pending-owners')} className="back-btn">
        ← Back to Pending Owners
      </button>
    </div>
  );
};

export default ManageOwnerPage;
