import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      try {
        const stored = sessionStorage.getItem('hp_user');
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    const result = await authService.login(email, password);
    setUser(result.user);
    sessionStorage.setItem('hp_user', JSON.stringify(result.user));
    return result.user;
  }, []);

  const register = useCallback(async (userData) => {
    setError(null);
    const result = await authService.register(userData);
    setUser(result.user);
    sessionStorage.setItem('hp_user', JSON.stringify(result.user));
    return result.user;
  }, []);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    setUser(null);
    sessionStorage.removeItem('hp_user');
  }, []);

  const isRole = useCallback((...roles) => {
    return user && roles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      logout,
      isRole,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
