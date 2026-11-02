'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { type User } from '@/lib/types';
import { getCurrentUser, setCurrentUser, getUsers } from '@/lib/store';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: () => {},
  setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = getCurrentUser();
    if (saved) {
      // Refresh from users list to get latest credit score
      const users = getUsers();
      const fresh = users.find((u) => u.id === saved.id);
      setUser(fresh || saved);
    }
    setLoading(false);
  }, []);

  const refreshUser = useCallback(() => {
    const saved = getCurrentUser();
    if (saved) {
      const users = getUsers();
      const fresh = users.find((u) => u.id === saved.id);
      setUser(fresh || saved);
    } else {
      setUser(null);
    }
  }, []);

  const handleSetUser = useCallback((u: User | null) => {
    setCurrentUser(u);
    setUser(u);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, setUser: handleSetUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
