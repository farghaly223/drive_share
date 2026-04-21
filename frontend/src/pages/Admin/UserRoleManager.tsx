import { useEffect, useState } from 'react';
import { authApi } from '../../services/authApi';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

interface User {
  id: number;          // changed from userId
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
      await fetchUsers(); // refresh list
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
      <h2>User Role Management</h2>
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
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  disabled={updating === user.id}
                >
                  <option value="renter">Renter</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </select>
                {updating === user.id && <span> Updating...</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserRoleManager;