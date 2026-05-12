import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin, isOwner, isRenter } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotification();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleDropdown = () => {
    if (!open) markAllAsRead();
    setOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">DriveShare</Link>
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

            {/* Notification Bell */}
            <li className="notification-bell" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="bell-button">
                🔔
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              </button>
              {open && (
                <div className="notification-dropdown">
                  <div className="dropdown-header">
                    <strong>Notifications</strong>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="mark-read-btn">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="dropdown-body">
                    {notifications.length === 0 ? (
                      <p className="empty-msg">No notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`notification-item ${!n.isRead ? 'unread' : ''}`}
                        >
                          <p>{n.message}</p>
                          {n.createdAt && (
                            <span className="time">
                              {new Date(n.createdAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </li>

            <li className="user-info">
              <Link to="/profile" style={{ marginRight: '0.5rem' }}>
                {user?.email}
              </Link>
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
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
