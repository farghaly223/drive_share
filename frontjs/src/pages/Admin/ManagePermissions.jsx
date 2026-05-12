import { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const ManagePermissions = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  const fetchUsers = async () => {
    try { setLoading(true); const res = await adminApi.getAllUserPermissions(); setUsers(res.data); } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchUsers(); }, []);

  const handleToggle = async (userId, field) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const newValue = !user[field];
    const updated = { ...user, [field]: newValue };
    setUpdating(userId);
    try { await adminApi.updateUserPermissions(userId, updated); setUsers(prev => prev.map(u => u.id === userId ? updated : u)); } catch (err) { alert('Update failed'); } finally { setUpdating(null); }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;
  return (
    <div>
      <h2>Manage Permissions</h2>
      <table>
        <thead><tr><th>ID</th><th>Email</th><th>Role</th><th>Suspended</th><th>Can Add Cars</th><th>Can Rent Cars</th></tr></thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}><td>{user.id}</td><td>{user.email}</td><td>{user.role}</td>
              <td><input type="checkbox" checked={user.isSuspended} onChange={() => handleToggle(user.id, 'isSuspended')} disabled={updating === user.id} /></td>
              <td><input type="checkbox" checked={user.canAddCars} onChange={() => handleToggle(user.id, 'canAddCars')} disabled={updating === user.id} /></td>
              <td><input type="checkbox" checked={user.canRentCars} onChange={() => handleToggle(user.id, 'canRentCars')} disabled={updating === user.id} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ManagePermissions;