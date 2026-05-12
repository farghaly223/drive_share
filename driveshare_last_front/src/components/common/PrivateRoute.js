import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * PrivateRoute — Frontend Authorization Guard
 * ─────────────────────────────────────────────────────────────
 * Wraps protected routes and enforces three authorization layers:
 *
 *  1. Authentication check  → unauthenticated users → /login
 *  2. Suspension check      → suspended accounts   → /suspended
 *  3. Role-based check      → wrong role            → / (home)
 *
 * Usage in App.js:
 *   <Route element={<PrivateRoute />}>                            // any logged-in user
 *   <Route element={<PrivateRoute allowedRoles={['admin']} />}>   // admin only
 *   <Route element={<PrivateRoute allowedRoles={['owner']} />}>   // owner only
 *   <Route element={<PrivateRoute allowedRoles={['renter']} />}>  // renter only
 *
 * @param {string[]} [allowedRoles] - optional list of roles that may access child routes
 */
const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading, isSuspended } = useAuth();

  // Wait for auth state to be restored from localStorage
  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  // GUARD 1 — Must be authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // GUARD 2 — Suspended accounts cannot access any protected route
  if (isSuspended) {
    return <Navigate to="/suspended" replace />;
  }

  // GUARD 3 — Role-based access control
  if (allowedRoles && user) {
    const userRoleLower = user.role.toLowerCase();
    const allowedLower = allowedRoles.map((r) => r.toLowerCase());

    if (!allowedLower.includes(userRoleLower)) {
      // Redirect to home; role-specific redirect happens via HomeRedirect
      return <Navigate to="/" replace />;
    }
  }

  // All guards passed — render the child route
  return <Outlet />;
};

export default PrivateRoute;
