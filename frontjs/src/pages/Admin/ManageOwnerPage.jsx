import { useState, useEffect } from 'react';
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
    adminApi.getPendingOwners().then(res => {
      const found = res.data.find(o => o.id === Number(id));
      setOwner(found || { id: Number(id), name: `Owner ${id}`, email: `owner${id}@example.com`, registrationDate: new Date().toISOString(), status: 'Pending' });
    }).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (approve) => {
    if (!owner) return;
    setProcessing(true);
    try { await adminApi.manageOwner(owner.id, approve); setMessage(`Owner ${approve ? 'approved' : 'rejected'}.`); setTimeout(() => navigate('/admin/dashboard'), 1500); } 
    catch (err) { setError(err.message); } finally { setProcessing(false); }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;
  return (
    <div>
      <h2>Manage Car Owner</h2>
      <div className="owner-details"><p><strong>Name:</strong> {owner.name}</p><p><strong>Email:</strong> {owner.email}</p><p><strong>Registered:</strong> {new Date(owner.registrationDate).toLocaleDateString()}</p><p><strong>Status:</strong> {owner.status}</p></div>
      {owner.status === 'Pending' && <div className="actions"><button onClick={() => handleAction(true)} disabled={processing} className="approve-btn">Approve</button><button onClick={() => handleAction(false)} disabled={processing} className="reject-btn">Reject</button></div>}
      {message && <div className="success-message">{message}</div>}
      <button onClick={() => navigate('/admin/dashboard')} className="back-btn">Back</button>
    </div>
  );
};
export default ManageOwnerPage;