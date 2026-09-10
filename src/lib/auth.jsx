import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, clearToken, setToken } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const me = await api("/auth/me");
      setProfile(me);
      return me;
    } catch {
      clearToken();
      setProfile(null);
      return null;
    }
  }, []);

  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const login = async (email, password) => {
    const { session } = await api("/auth/login", { method: "POST", body: { email, password } });
    setToken(session.access_token);
    return refresh();
  };

  const register = async (full_name, email, password, role = "student", extra = {}) => {
    const { session } = await api("/auth/register", {
      method: "POST",
      body: { full_name, email, password, role, ...extra },
    });
    setToken(session.access_token);
    return refresh();
  };

  const logout = () => {
    clearToken();
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ profile, loading, login, register, logout, refresh, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
