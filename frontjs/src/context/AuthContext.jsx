import { createContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {};

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token, user: apiUser } = res.data;
    localStorage.setItem('token', token);
    const userData = {
      token,
      email: apiUser.email,
      role: apiUser.role,
      userId: apiUser.id,
      isSuspended: apiUser.isSuspended,
      canAddCars: apiUser.canAddCars,
      canRentCars: apiUser.canRentCars,
      isLicenseVerified: apiUser.isLicenseVerified,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isOwner = user?.role === 'owner';
  const isRenter = user?.role === 'renter';
  const isLicenseVerified = user?.isLicenseVerified ?? true;
  const isSuspended = user?.isSuspended ?? false;
  const canAddCars = user?.canAddCars ?? false;
  const canRentCars = user?.canRentCars ?? false;

  return (
    <AuthContext.Provider value={{
      user, loading, login, logout, refreshUser,
      isAuthenticated, isAdmin, isOwner, isRenter,
      isLicenseVerified, isSuspended, canAddCars, canRentCars
    }}>
      {children}
    </AuthContext.Provider>
  );
};