import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { authService } from "../services/authService";
import { STORAGE_KEYS, ROLES } from "../utils/constants";
import { decodeJwt, isTokenExpired } from "../utils/jwt";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      }
    } else {
      // Cleanup expired
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    // Expected backend response: { token, user: { id, name, email, role } }
    const receivedToken = data.token || data.accessToken;
    let receivedUser = data.user;

    // Fallback: derive user info from JWT if backend didn't send it
    if (!receivedUser && receivedToken) {
      const decoded = decodeJwt(receivedToken);
      receivedUser = {
        email: decoded?.sub || decoded?.email,
        role: decoded?.role || decoded?.roles?.[0] || ROLES.USER,
        name: decoded?.name || decoded?.sub,
      };
    }

    localStorage.setItem(STORAGE_KEYS.TOKEN, receivedToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    toast.success(`Welcome back, ${receivedUser?.name || "user"}!`);
    return receivedUser;
  };

  const register = async (payload) => {
    const { data } = await authService.register(payload);
    toast.success("Account created. Please log in.");
    return data;
  };

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
    toast.info("Logged out.");
  }, []);

  const isAuthenticated = !!token && !isTokenExpired(token);
  const isAdmin = user?.role === ROLES.ADMIN;

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
