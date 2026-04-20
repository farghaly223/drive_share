import { createContext, useState, useCallback, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && token) {
      try { setUser(JSON.parse(storedUser)); }
      catch { localStorage.removeItem('user'); }
    }
  }, [token]);

  const register = useCallback(async (email, password, fullName, role, confirmPassword) => {
    setLoading(true); setError(null);
    try {
      const res = await authAPI.register({ name: fullName, email, password, confirmPassword: confirmPassword || password, role });
      // Backend AuthResponseDto: { success, message, token, user, expiresIn }  (flat — no nested .data)
      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token); setUser(user);
        return { success: true, user };
      }
      setError(res.data.message);
      return { success: false, message: res.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message); return { success: false, message };
    } finally { setLoading(false); }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    try {
      const res = await authAPI.login({ email, password });
      // Backend AuthResponseDto: { success, message, token, user, expiresIn }  (flat — no nested .data)
      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token); setUser(user);
        return { success: true, user };
      }
      setError(res.data.message);
      return { success: false, message: res.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message); return { success: false, message };
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token'); localStorage.removeItem('user');
    setToken(null); setUser(null); setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, register, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
