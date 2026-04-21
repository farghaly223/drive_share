import { useEffect, useState } from 'react';
import { authApi } from '../../services/authApi';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

interface User {
  id: number;
  email: string;
  role: string;
}

const UserRoleManager = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await authApi.getAllUsers();
      setUsers(usersData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: string) => {
    if (!window.confirm(`Change user ${userId} role to ${newRole}?`)) return;
    setUpdating(userId);
    try {
      await authApi.updateUserRole(userId, newRole);
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', margin: 0 }}>User Role Management</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{users.length} users</span>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>#{user.id}</td>
                <td><strong>{user.email}</strong></td>
                <td>
                  <span className={`status-badge ${
                    user.role === 'admin' ? 'status-completed' :
                    user.role === 'owner' ? 'status-accepted' :
                    'status-pending'
                  }`} style={{ textTransform: 'capitalize' }}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={updating === user.id}
                      style={{
                        padding: '0.4rem 0.7rem',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)',
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '0.825rem',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="renter">Renter</option>
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                    {updating === user.id && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>Updating...</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserRoleManager;
