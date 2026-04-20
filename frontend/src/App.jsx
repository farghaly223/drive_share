import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';

import Login          from './pages/Login';
import Register       from './pages/Register';
import Browse         from './pages/Browse';
import CarDetails     from './pages/CarDetails';
import MyBookings     from './pages/MyBookings';
import MyCars         from './pages/MyCars';
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path="/"            element={<Navigate to="/browse" />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/register"    element={<Register />} />
          <Route path="/browse"      element={<Browse />} />
          <Route path="/car/:id"     element={<CarDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/my-cars"     element={<MyCars />} />
          <Route path="/admin"       element={<AdminDashboard />} />
          <Route path="*"            element={<Navigate to="/browse" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
