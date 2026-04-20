import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import './Admin.css';

export default function Admin() {
  const [pendingOwners, setPendingOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Check if user is admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>Only admins can access this page</p>
        <button className="btn btn-primary" onClick={() => navigate('/browse')}>
          Go to Browse
        </button>
      </div>
    );
  }

  useEffect(() => {
    fetchPendingOwners();
  }, []);

  const fetchPendingOwners = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getPendingOwners();
      setPendingOwners(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load pending owners';
      setError(message);
      console.error('Error fetching pending owners:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (ownerId) => {
    try {
      await adminAPI.approveOwner(ownerId, { approved: true });
      setPendingOwners(pendingOwners.filter(owner => owner.id !== ownerId));
      alert('Owner approved successfully!');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to approve owner';
      alert(message);
      console.error('Error approving owner:', err);
    }
  };

  const handleReject = async (ownerId) => {
    try {
      await adminAPI.rejectOwner(ownerId, { approved: false });
      setPendingOwners(pendingOwners.filter(owner => owner.id !== ownerId));
      alert('Owner rejected');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reject owner';
      alert(message);
      console.error('Error rejecting owner:', err);
    }
  };

  return (
    <div className="admin-container">
      <div className="header">
        <h1>Admin Dashboard</h1>
        <p>Manage user registrations and vehicle approvals</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-section">
        <h2>Pending Owner Approvals</h2>
        
        {loading ? (
          <div className="loading">Loading pending owners...</div>
        ) : pendingOwners.length === 0 ? (
          <div className="no-results">
            <p>No pending owner approvals</p>
            <button className="btn btn-primary" onClick={fetchPendingOwners}>
              Refresh
            </button>
          </div>
        ) : (
          <div className="owners-grid">
            {pendingOwners.map((owner) => (
              <div key={owner.id} className="owner-card">
                <div className="owner-info">
                  <h3>{owner.name}</h3>
                  <p className="email">📧 {owner.email}</p>
                  <p className="role">Role: <strong>{owner.role}</strong></p>
                  {owner.accountStatus && (
                    <p className="status">Status: {owner.accountStatus}</p>
                  )}
                </div>
                <div className="owner-actions">
                  <button
                    className="btn btn-success"
                    onClick={() => handleApprove(owner.id)}
                  >
                    ✓ Approve
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleReject(owner.id)}
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
