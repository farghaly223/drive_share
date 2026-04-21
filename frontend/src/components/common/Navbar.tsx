import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin, isOwner, isRenter } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Motion<span style={{ color: 'var(--accent)' }}>X</span></Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/browse">Browse Cars</Link>
        </li>
        {isAuthenticated && (
          <>
            {isRenter && (
              <li>
                <Link to="/bookings/my">My Bookings</Link>
              </li>
            )}
            {isOwner && (
              <>
                <li>
                  <Link to="/cars/manage">My Cars</Link>
                </li>
                <li>
                  <Link to="/bookings/requests">Rental Requests</Link>
                </li>
              </>
            )}
            {isAdmin && (
              <li>
                <Link to="/admin/dashboard">Admin Dashboard</Link>
              </li>
            )}
            <li className="user-info">
              <span>{user?.email}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </>
        )}
        {!isAuthenticated && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register" style={{ color: 'var(--accent)', background: 'var(--accent-dim)', padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
