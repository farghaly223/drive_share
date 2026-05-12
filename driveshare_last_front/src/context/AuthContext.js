import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';

/**
 * AUTH CONTEXT
 * ──────────────────────────────────────────────────────
 * Stores the authenticated user and exposes derived booleans
 * (isAdmin, isOwner, isRenter, isSuspended, canAddCars, canRentCars)
 * that components and route guards can use without re-fetching the server.
 *
 * Authorization flow:
 *  1. login() → server returns token + user payload → stored in localStorage
 *  2. On app load → restores from localStorage (no extra /me call needed)
 *  3. logout() → clears localStorage + resets state
 *  4. All derived booleans are computed from the stored user object
 */

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch {
        // Corrupt data – force a clean state
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Authenticates the user, persists token + user data, updates context.
   * Returns the user data object so callers can redirect based on role.
   */
  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const loginData = res.data;

    const { token, user: apiUser } = loginData;

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

  /**
   * refreshUser can be called after license upload, etc.
   * Currently a no-op since permissions come from login payload.
   */
  const refreshUser = async () => {
    return;
  };

  // ── Derived authorization flags ──────────────────────
  const isAuthenticated = !!user;
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const isOwner = user?.role?.toLowerCase() === 'owner';
  const isRenter = user?.role?.toLowerCase() === 'renter';
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
