import { useAuth } from '../../hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="page-header">
        <h2>Profile</h2>
      </div>
      <div className="profile-card">
        <h2>Account Details</h2>
        <div className="profile-row">
          <span className="label">Email</span>
          <span className="value">{user?.email}</span>
        </div>
        <div className="profile-row">
          <span className="label">Role</span>
          <span className="value" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
        </div>
        <div className="profile-row">
          <span className="label">User ID</span>
          <span className="value" style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>#{user?.userId}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
