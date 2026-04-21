import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface PrivateRouteProps {
  allowedRoles?: string[];
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user) {
  const userRoleLower = user.role.toLowerCase();
  const allowedLower = allowedRoles.map(r => r.toLowerCase());
  if (!allowedLower.includes(userRoleLower)) {
    return <Navigate to="/" replace />;
  }
}

  return <Outlet />;
};

export default PrivateRoute;