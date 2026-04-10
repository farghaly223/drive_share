import { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi, getMe } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const res = await loginApi({ email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);

      const me = await getMe();
      setUser(me.data);

      return me.data;
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await getMe();
      setUser(res.data);
    } catch (err) {
      console.error(err);
      logout();
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
