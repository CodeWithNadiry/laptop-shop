/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
  token: null,
  userId: null,
  role: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true, // new
  login: () => {},
  logout: () => {},
});

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // new

  // 🔁 Restore auth on refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedUserId && storedRole) {
      setToken(storedToken);
      setUserId(storedUserId);
      setRole(storedRole);
    }

    setIsLoading(false); // done loading
  }, []);

  // 🔐 LOGIN
  const login = ({ token, userId, role }) => {
    setToken(token);
    setUserId(userId);
    setRole(role);

    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("role", role);
  };

  // 🚪 LOGOUT
  const logout = () => {
    setToken(null);
    setUserId(null);
    setRole(null);

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
  };

  const value = {
    token,
    userId,
    role,
    isAuthenticated: !!token,
    isAdmin: role === "admin",
    isLoading, // added
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
export default AuthContextProvider;
