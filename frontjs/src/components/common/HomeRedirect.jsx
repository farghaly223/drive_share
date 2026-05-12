import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import HomePage from '../../pages/Home/HomePage';

const HomeRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <HomePage />;
  const role = user?.role?.toLowerCase();
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'owner') return <Navigate to="/cars/manage" replace />;
  return <Navigate to="/browse" replace />;
};
export default HomeRedirect;