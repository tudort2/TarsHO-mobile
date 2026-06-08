import React, { createContext, useContext, useState, useCallback } from 'react';
import { Role, User } from '../types';
import { api, setToken } from '../api/client';

interface AuthContextValue {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: Role) => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.auth.login(email, password);
    setToken(res.token);
    setTokenState(res.token);
    setUser(normalizeUser(res.user));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenState(null);
    setUser(null);
  }, []);

  const switchRole = useCallback(async (role: Role) => {
    const res = await api.auth.switchRole(role);
    setToken(res.token);
    setTokenState(res.token);
    setUser(normalizeUser(res.user));
  }, []);

  const updateUser = useCallback((partial: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...partial } : prev);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, switchRole, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function normalizeUser(raw: any): User {
  return {
    id: raw.id,
    name: `${raw.first_name} ${raw.last_name}`,
    email: raw.email,
    role: raw.role as Role,
    roles: (raw.roles || [raw.role]) as Role[],
    avatarUrl: raw.avatar_url || undefined,
    phone: raw.phone || undefined,
    brokerage: raw.brokerage || undefined,
    licenseNo: raw.license_no || undefined,
  };
}
