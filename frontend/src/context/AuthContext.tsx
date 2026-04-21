import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../services/authApi';
import type { AuthResponse } from '../types';

interface AuthContextType {
  user: AuthResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>; // <-- changed
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isRenter: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authApi.me()
        .then((res) => {
          console.log('🔍 /me response:', res.data);        // <-- ADD
          console.log('🔍 Role value:', res.data.role);     // <-- ADD
          const userData: AuthResponse = {
            token,
            email: res.data.email,
            role: res.data.role,
            userId: res.data.userId,
          };
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const res = await authApi.login({ email, password });
    const { token } = res.data;
    localStorage.setItem('token', token);
    const meRes = await authApi.me();
    console.log('🔍 /me after login:', meRes.data);
    const userData: AuthResponse = {
      token,
      email: meRes.data.email,
      role: meRes.data.role,
      userId: meRes.data.userId,
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isOwner,
        isRenter,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};