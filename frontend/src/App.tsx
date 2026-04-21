import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/common/Layout';
import PrivateRoute from './components/common/PrivateRoute';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import BrowseCarsPage from './pages/Browsing/BrowseCarsPage';
import CarPublicDetailPage from './pages/Browsing/CarPublicDetailPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageOwnerPage from './pages/Admin/ManageOwnerPage';
import CarListPage from './pages/Cars/CarListPage';
import CarFormPage from './pages/Cars/CarFormPage';
import MyBookingsPage from './pages/Bookings/MyBookingsPage';
import BookingRequestsPage from './pages/Bookings/BookingRequestsPage';
import ProfilePage from './pages/Profile/ProfilePage';

const HomeRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <HomePage />;
  const role = user?.role?.toLowerCase();
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'owner') return <Navigate to="/cars/manage" replace />;
  return <Navigate to="/browse" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomeRedirect />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="browse" element={<BrowseCarsPage />} />
            <Route path="browse/:id" element={<CarPublicDetailPage />} />

            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Admin routes */}
            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              <Route path="admin/manage-owner/:id" element={<ManageOwnerPage />} />
            </Route>

            {/* Car Owner routes */}
            <Route element={<PrivateRoute allowedRoles={['owner']} />}>
              <Route path="cars/manage" element={<CarListPage />} />
              <Route path="cars/create" element={<CarFormPage />} />
              <Route path="cars/edit/:id" element={<CarFormPage />} />
              <Route path="bookings/requests" element={<BookingRequestsPage />} />
            </Route>

            {/* Renter routes */}
            <Route element={<PrivateRoute allowedRoles={['renter']} />}>
              <Route path="bookings/my" element={<MyBookingsPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;