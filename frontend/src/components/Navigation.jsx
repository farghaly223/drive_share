import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navigation.css';

export default function Navigation() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <a href="/" className="logo">🚗 DriveShare</a>
        </div>

        <ul className="nav-links">
          <li className={pathname === '/browse' ? 'nav-active' : ''}>
            <a href="/browse">Browse</a>
          </li>

          {isAuthenticated && user?.role === 'renter' && (
            <li className={pathname === '/my-bookings' ? 'nav-active' : ''}>
              <a href="/my-bookings">My Bookings</a>
            </li>
          )}
          {isAuthenticated && user?.role === 'owner' && (
            <li className={pathname === '/my-cars' ? 'nav-active' : ''}>
              <a href="/my-cars">My Cars</a>
            </li>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <li className={pathname === '/admin' ? 'nav-active' : ''}>
              <a href="/admin">Admin</a>
            </li>
          )}

          <li><div className="nav-divider" /></li>

          {isAuthenticated ? (
            <li>
              <div className="nav-user">
                <div className="nav-avatar">{initials}</div>
                <div>
                  <div className="nav-name">{user?.name || 'User'}</div>
                  <span className={`nav-role nav-role-${user?.role}`}>{user?.role}</span>
                </div>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            </li>
          ) : (
            <li>
              <div className="auth-nav-btns">
                <a href="/login" className="nav-login">Login</a>
                <a href="/register" className="nav-register">Register</a>
              </div>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
