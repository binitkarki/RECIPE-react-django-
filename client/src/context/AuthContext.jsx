import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);

  useEffect(() => {
    if (accessToken) {
      const username = localStorage.getItem("username");
      setUser(username ? { username } : null);
    } else {
      setUser(null);
    }
  }, [accessToken]);

  const login = ({ username, access }) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("username", username);
    setAccessToken(access);
    setUser({ username });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
