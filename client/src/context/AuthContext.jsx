import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { authService } from "../services/authService";
import { STORAGE_KEYS, ROLES } from "../utils/constants";
import { decodeJwt, isTokenExpired } from "../utils/jwt";

const AuthContext = createContext(null);
const unwrap = (response) => response.data?.data ?? response.data;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

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
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const payload = unwrap(response);

    const receivedToken = payload?.token;
    if (!receivedToken) {
      throw new Error("Login response missing token");
    }

    //Map backend roles (ROLE_USER / ROLE_ADMIN) to our frontend role
    const backendRoles = payload?.roles || [];
    const role = backendRoles.includes("ROLE_ADMIN") ? ROLES.ADMIN : ROLES.USER;

    let receivedUser = {
      email: payload.email,
      name: payload.fullName,
      role,
    };

    if (!receivedUser.email && receivedToken) {
      const decoded = decodeJwt(receivedToken);
      receivedUser = {
        ...receivedUser,
        email: receivedUser.email || decoded?.sub,
        name: receivedUser.name || decoded?.sub,
      };
    }

    localStorage.setItem(STORAGE_KEYS.TOKEN, receivedToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);

    toast.success(`Welcome back, ${receivedUser.name || receivedUser.email}!`);
    return receivedUser;
  };

  const register = async (payload) => {
    const response = await authService.register(payload);
    unwrap(response); 
    toast.success("Account created. Please log in.");
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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};