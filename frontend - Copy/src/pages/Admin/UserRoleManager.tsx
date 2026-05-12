import { useEffect, useState } from 'react';
import { authApi } from '../../services/authApi';
import { adminApi } from '../../services/adminApi';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';
import type { UserWithPermissions } from '../../types';
import { getErrorMessage } from '../../utils/helpers';

const UserRoleManager = () => {
  const [users, setUsers] = useState<UserWithPermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const usersData = await authApi.getAllUsers();
      // Ensure permissions fields exist; default to false if missing
      const sanitized = usersData.map(u => ({
        ...u,
        canAddCars: u.canAddCars ?? false,
        canRentCars: u.canRentCars ?? false,
        isSuspended: u.isSuspended ?? false,
      }));
      setUsers(sanitized);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePermissionToggle = async (userId: number, field: keyof UserWithPermissions) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newValue = !user[field];
    const updatedPermissions = {
      isSuspended: field === 'isSuspended' ? newValue : user.isSuspended,
      canAddCars: field === 'canAddCars' ? newValue : user.canAddCars,
      canRentCars: field === 'canRentCars' ? newValue : user.canRentCars,
    };

    setUpdating(userId);
    try {
      await adminApi.updateUserPermissions(userId, updatedPermissions);

      // Optimistic update
      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, ...updatedPermissions } : u
        )
      );
    } catch (err) {
      alert('Permission update failed: ' + getErrorMessage(err));
    } finally {
      setUpdating(null);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    if (!window.confirm(`Change user ${userId} role to ${newRole}?`)) return;
    setUpdating(userId);
    try {
      await authApi.updateUserRole(userId, newRole);
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      <h2>User Role & Permission Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
            <th>Suspended</th>
            <th>Can Add Cars</th>
            <th>Can Rent Cars</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
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
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={user.isSuspended}
                  onChange={() => handlePermissionToggle(user.id, 'isSuspended')}
                  disabled={updating === user.id}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={user.canAddCars}
                  onChange={() => handlePermissionToggle(user.id, 'canAddCars')}
                  disabled={updating === user.id}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={user.canRentCars}
                  onChange={() => handlePermissionToggle(user.id, 'canRentCars')}
                  disabled={updating === user.id}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserRoleManager;