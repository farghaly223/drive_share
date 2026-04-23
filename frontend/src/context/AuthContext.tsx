import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../services/authApi';
import type { AuthResponse } from '../types';

interface AuthContextType {
  user: AuthResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isRenter: boolean;
  isLicenseVerified: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
    const meRes = await authApi.me();
    const userData: AuthResponse = {
      token,
      email: meRes.data.email,
      role: meRes.data.role,
      userId: meRes.data.userId,
      isLicenseVerified: meRes.data.isLicenseVerified ?? (meRes.data.role !== 'renter'),
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }
};

  useEffect(() => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  if (token && storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      // Ensure isLicenseVerified is set (default to true if missing for non-renters)
      const userData: AuthResponse = {
        ...parsedUser,
        isLicenseVerified: parsedUser.isLicenseVerified ?? (parsedUser.role !== 'renter'),
      };
      setUser(userData);
    } catch {
      refreshUser();
    }
  }
  setLoading(false);
}, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const res = await authApi.login({ email, password });
    const { token } = res.data;
    localStorage.setItem('token', token);
    const meRes = await authApi.me();
    const userData: AuthResponse = {
          token,
          email: meRes.data.email,
          role: meRes.data.role,
          userId: meRes.data.userId,
          isLicenseVerified: meRes.data.isLicenseVerified ?? (meRes.data.role !== 'renter'),
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
  const isLicenseVerified = user?.isLicenseVerified ?? true; // default true for non-renters?

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};