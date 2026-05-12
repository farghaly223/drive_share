import { useEffect, useState } from 'react';
import { authApi } from '../../services/authApi';
import { adminApi } from '../../services/adminApi';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';
import { getErrorMessage } from '../../utils/helpers';

const UserRoleManager = () => {
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const usersData = await authApi.getAllUsers();
      let permsData = [];
      try { const res = await adminApi.getAllUserPermissions(); permsData = res.data; } catch (e) {}
      setUsers(usersData);
      setPermissions(permsData);
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const getPermission = (userId) => permissions.find(p => p.id === userId) || { id: userId, isSuspended: false, canAddCars: false, canRentCars: false };

  const handlePermissionToggle = async (userId, field) => {
    const perm = getPermission(userId);
    const newValue = !perm[field];
    const updated = {
      isSuspended: field === 'isSuspended' ? newValue : perm.isSuspended,
      canAddCars: field === 'canAddCars' ? newValue : perm.canAddCars,
      canRentCars: field === 'canRentCars' ? newValue : perm.canRentCars,
    };
    setUpdating(userId);
    try { await adminApi.updateUserPermissions(userId, updated); setPermissions(prev => prev.map(p => p.id === userId ? { ...p, ...updated } : p)); } catch (err) { alert(getErrorMessage(err)); }
    finally { setUpdating(null); }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm('Change role?')) return;
    setUpdating(userId);
    try { await authApi.updateUserRole(userId, newRole); setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u)); } catch (err) { setError(getErrorMessage(err)); }
    finally { setUpdating(null); }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      <h2>User Role & Permission Management</h2>
      <table>
        <thead><tr><th>ID</th><th>Email</th><th>Role</th><th>Change Role</th><th>Suspended</th><th>Can Add Cars</th><th>Can Rent Cars</th></tr></thead>
        <tbody>
          {users.map(u => {
            const perm = getPermission(u.id);
            return (
              <tr key={u.id}><td>{u.id}</td><td>{u.email}</td><td>{u.role}</td>
                <td><select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)} disabled={updating === u.id}><option value="renter">Renter</option><option value="owner">Owner</option><option value="admin">Admin</option></select></td>
                <td><input type="checkbox" checked={perm.isSuspended} onChange={() => handlePermissionToggle(u.id, 'isSuspended')} disabled={updating === u.id} /></td>
                <td><input type="checkbox" checked={perm.canAddCars} onChange={() => handlePermissionToggle(u.id, 'canAddCars')} disabled={updating === u.id} /></td>
                <td><input type="checkbox" checked={perm.canRentCars} onChange={() => handlePermissionToggle(u.id, 'canRentCars')} disabled={updating === u.id} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default UserRoleManager;