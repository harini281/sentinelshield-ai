import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { UserRole, AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const DEMO_ACCOUNTS: Record<string, { name: string; role: UserRole }> = {
  'admin@sentinel.ai': { name: 'Alex Morgan', role: 'admin' },
  'user@sentinel.ai': { name: 'Jordan Lee', role: 'user' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthState['user']>(() => {
    try {
      const saved = localStorage.getItem('sentinel_auth');
      return saved ? (JSON.parse(saved) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email: string, _password: string): Promise<AuthUser> => {
    await new Promise((r) => setTimeout(r, 700));
    const account = DEMO_ACCOUNTS[email.toLowerCase()];
    const authUser: AuthUser = {
      email,
      name: account?.name ?? email.split('@')[0].replace(/^\w/, (c) => c.toUpperCase()),
      role: account?.role ?? 'user',
    };
    setUser(authUser);
    try {
      localStorage.setItem('sentinel_auth', JSON.stringify(authUser));
    } catch {
      /* ignore */
    }
    return authUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem('sentinel_auth');
    } catch {
      /* ignore */
    }
  }, []);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function roleRedirectPath(role: UserRole): string {
  return role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
}
