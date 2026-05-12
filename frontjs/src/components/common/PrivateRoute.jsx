import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading, isSuspended } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isSuspended) return <Navigate to="/suspended" replace />;
  if (allowedRoles && user) {
    const userRoleLower = user.role.toLowerCase();
    if (!allowedRoles.map(r => r.toLowerCase()).includes(userRoleLower))
      return <Navigate to="/" replace />;
  }
  return <Outlet />;
};
export default PrivateRoute;