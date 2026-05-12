import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const SuspendedPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="suspended-page">
      <div className="suspended-card">
        <div className="suspended-icon">🚫</div>
        <h1>Account Suspended</h1>
        <p>
          Your account has been suspended. Please contact the administrator for further
          assistance.
        </p>
        <button onClick={handleLogout} className="btn-primary">
          Return to Login
        </button>
      </div>
    </div>
  );
};

export default SuspendedPage;
