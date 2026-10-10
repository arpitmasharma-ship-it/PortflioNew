import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, getErrorMessage } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const status = await api.get('/auth/setup-status');
      setNeedsSetup(status.data.data.needsSetup);
      if (!status.data.data.needsSetup) {
        try {
          const me = await api.get('/auth/me');
          setUser(me.data.data);
        } catch {
          setUser(null);
        }
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const value = useMemo(
    () => ({
      user,
      needsSetup,
      loading,
      async login(payload) {
        const res = await api.post('/auth/login', payload);
        setUser(res.data.data);
        setNeedsSetup(false);
        return res.data;
      },
      async setup(payload) {
        const res = await api.post('/auth/setup', payload);
        setUser(res.data.data);
        setNeedsSetup(false);
        return res.data;
      },
      async logout() {
        await api.post('/auth/logout');
        setUser(null);
      },
      getErrorMessage,
      refresh,
    }),
    [user, needsSetup, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
