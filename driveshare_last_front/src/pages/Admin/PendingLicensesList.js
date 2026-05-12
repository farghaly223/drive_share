import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const PendingLicensesList = () => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getPendingLicenses();
      setLicenses(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending licenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const handleAction = async (id, approve) => {
    setProcessing(id);
    try {
      await adminApi.verifyLicense(id, approve);
      await fetchLicenses();
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
        <h2>Pending License Verifications</h2>
        <span className="text-muted">{licenses.length} pending</span>
      </div>

      {licenses.length === 0 ? (
        <div className="empty-state">
          <p>No pending licenses.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>License</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((license) => (
                <tr key={license.id}>
                  <td>{license.id}</td>
                  <td>{license.name}</td>
                  <td>{license.email}</td>
                  <td>
                    <a
                      href={license.driverLicenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-link"
                    >
                      View License ↗
                    </a>
                  </td>
                  <td>{new Date(license.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="actions">
                      <button
                        onClick={() => handleAction(license.id, true)}
                        disabled={processing === license.id}
                        className="approve-btn"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(license.id, false)}
                        disabled={processing === license.id}
                        className="reject-btn"
                      >
                        Reject
                      </button>
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

export default PendingLicensesList;
