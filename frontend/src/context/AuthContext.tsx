import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../services/authApi';
import type { AuthResponse } from '../types';

interface AuthContextType {
  user: AuthResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;   // keep the signature but we won't call it for permissions
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isRenter: boolean;
  isLicenseVerified: boolean;
  isSuspended: boolean;
  canAddCars: boolean;
  canRentCars: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // refreshUser can still be used for license verifications, but we won't call it for permissions
  const refreshUser = async () => {
    // Keep this empty or remove it – we don't need /me for permissions anymore
    return;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Use stored values – they were set during login and already contain the correct booleans
        setUser(parsed);
      } catch {
        // If parsing fails, force logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

const login = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await authApi.login({ email, password });
  const loginData = res.data;   // type: LoginResponse

  const { token, user: apiUser } = loginData;

  localStorage.setItem('token', token);

  const userData: AuthResponse = {
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
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
        isAuthenticated,
        isAdmin,
        isOwner,
        isRenter,
        isLicenseVerified,
        isSuspended,
        canAddCars,
        canRentCars,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};