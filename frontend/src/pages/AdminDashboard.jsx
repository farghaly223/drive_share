import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { adminAPI, carsAPI } from '../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tab, setTab] = useState('owners');
  const [pendingOwners, setPendingOwners] = useState([]);
  const [pendingCars, setPendingCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') { navigate('/browse'); return; }
    fetchAll();
  }, [isAuthenticated, user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [ownersRes, carsRes] = await Promise.allSettled([
        adminAPI.getPendingOwners(),
        adminAPI.getPendingCars(),
      ]);
      if (ownersRes.status === 'fulfilled') {
        const d = ownersRes.value.data;
        setPendingOwners(Array.isArray(d) ? d : []);
      }
      if (carsRes.status === 'fulfilled') {
        const d = carsRes.value.data;
        setPendingCars(Array.isArray(d) ? d : []);
      }
    } catch { /* individual errors handled above */ }
    finally { setLoading(false); }
  };

  const handleOwner = async (id, approve) => {
    try {
      await adminAPI.manageOwner(id, approve);
      setMsg({ text: `Owner ${approve ? 'approved' : 'rejected'} successfully.`, type: 'success' });
      setPendingOwners(p => p.filter(o => o.id !== id));
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Action failed', type: 'error' });
    }
  };

  const handleCar = async (id, approve) => {
    try {
      await adminAPI.manageCar(id, approve);
      setMsg({ text: `Car post ${approve ? 'approved' : 'rejected'}.`, type: 'success' });
      setPendingCars(p => p.filter(c => c.id !== id));
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Action failed', type: 'error' });
    }
  };

  const formatDate = (d) => {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
  };

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <div className="admin-page">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="section-sub">Manage owners, car listings, and platform activity</p>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="stat-card accent">
          <span className="stat-icon">👤</span>
          <span className="stat-label">Pending Owners</span>
          <span className="stat-value">{pendingOwners.length}</span>
        </div>
        <div className="stat-card blue">
          <span className="stat-icon">🚗</span>
          <span className="stat-label">Pending Cars</span>
          <span className="stat-value">{pendingCars.length}</span>
        </div>
        <div className="stat-card green">
          <span className="stat-icon">✅</span>
          <span className="stat-label">Actions Today</span>
          <span className="stat-value">—</span>
        </div>
        <div className="stat-card red">
          <span className="stat-icon">🔔</span>
          <span className="stat-label">Total Pending</span>
          <span className="stat-value">{pendingOwners.length + pendingCars.length}</span>
        </div>
      </div>

      {msg.text && (
        <div className={`alert alert-${msg.type === 'error' ? 'error' : 'success'}`}>
          {msg.text}
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={`tab-btn ${tab === 'owners' ? 'active' : ''}`} onClick={() => setTab('owners')}>
          Owner Approvals
          {pendingOwners.length > 0 && <span className="tab-count">{pendingOwners.length}</span>}
        </button>
        <button className={`tab-btn ${tab === 'cars' ? 'active' : ''}`} onClick={() => setTab('cars')}>
          Car Post Approvals
          {pendingCars.length > 0 && <span className="tab-count">{pendingCars.length}</span>}
        </button>
      </div>

      {loading ? (
        <div className="page-loading"><span className="spinner" /> Loading…</div>
      ) : tab === 'owners' ? (
        /* ── Pending Owners Table ── */
        pendingOwners.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">✅</span>
            <h3>All caught up!</h3>
            <p>No pending owner registrations to review.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingOwners.map(owner => (
                  <tr key={owner.id}>
                    <td>#{owner.id}</td>
                    <td className="td-name">{owner.name}</td>
                    <td>{owner.email}</td>
                    <td>{formatDate(owner.createdAt)}</td>
                    <td>
                      <div className="td-actions">
                        <button className="btn btn-success btn-sm" onClick={() => handleOwner(owner.id, true)}>
                          ✓ Approve
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleOwner(owner.id, false)}>
                          ✗ Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        /* ── Pending Cars Table ── */
        pendingCars.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">✅</span>
            <h3>All caught up!</h3>
            <p>No pending car posts to review.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Owner</th>
                  <th>Type</th>
                  <th>Price/Day</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingCars.map(car => (
                  <tr key={car.id}>
                    <td>#{car.id}</td>
                    <td className="td-name">{car.title || `${car.brand} ${car.model}`}</td>
                    <td>{car.ownerName || '—'}</td>
                    <td>{car.carType || '—'}</td>
                    <td>${car.rentalPrice ?? '—'}</td>
                    <td>{car.location || '—'}</td>
                    <td>
                      <div className="td-actions">
                        <button className="btn btn-success btn-sm" onClick={() => handleCar(car.id, true)}>
                          ✓ Approve
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleCar(car.id, false)}>
                          ✗ Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
