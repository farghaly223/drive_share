import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layout & Guards
import Layout from './components/common/Layout';
import PrivateRoute from './components/common/PrivateRoute';

// Pages
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
import SuspendedPage from './pages/Suspended/SuspendedPage';

/**
 * HomeRedirect
 * ─────────────────────────────────────────────────────
 * Smart redirect based on the user's role.
 * - Not authenticated → show the public HomePage
 * - Admin             → /admin/dashboard
 * - Owner             → /cars/manage
 * - Renter (default)  → /browse
 */
const HomeRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <HomePage />;
  const role = user?.role?.toLowerCase();
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'owner') return <Navigate to="/cars/manage" replace />;
  return <Navigate to="/browse" replace />;
};

/**
 * AppRoutes
 * ─────────────────────────────────────────────────────
 * Route tree with three tiers of authorization:
 *
 * PUBLIC  — anyone can visit (/, /login, /register, /browse, /browse/:id, /suspended)
 * PRIVATE — authenticated users only        → <PrivateRoute />
 * ROLE    — specific role required          → <PrivateRoute allowedRoles={['...']} />
 *
 * All role-guarded routes also inherit the authentication and suspension checks
 * from PrivateRoute, so there is a single consistent guard pipeline.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* ── Public Routes ──────────────────────────── */}
        <Route index element={<HomeRedirect />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="browse" element={<BrowseCarsPage />} />
        <Route path="browse/:id" element={<CarPublicDetailPage />} />
        <Route path="suspended" element={<SuspendedPage />} />

        {/* ── Authenticated Routes (any logged-in role) ─ */}
        <Route element={<PrivateRoute />}>
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* ── Admin-only Routes ──────────────────────── */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/manage-owner/:id" element={<ManageOwnerPage />} />
        </Route>

        {/* ── Owner-only Routes ──────────────────────── */}
        <Route element={<PrivateRoute allowedRoles={['owner']} />}>
          <Route path="cars/manage" element={<CarListPage />} />
          <Route path="cars/create" element={<CarFormPage />} />
          <Route path="cars/edit/:id" element={<CarFormPage />} />
          <Route path="bookings/requests" element={<BookingRequestsPage />} />
        </Route>

        {/* ── Renter-only Routes ─────────────────────── */}
        <Route element={<PrivateRoute allowedRoles={['renter']} />}>
          <Route path="bookings/my" element={<MyBookingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
