import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AdminUser } from '@/types/admin';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://nayha-server-kpw2.onrender.com';

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  permissions: Record<string, boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'nayha_admin_user';
const STORAGE_KEY_TOKEN = 'nayha_admin_token';
const STORAGE_KEY_PERMISSIONS = 'nayha_admin_permissions';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_TOKEN) || null;
  });

  const [permissions, setPermissions] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PERMISSIONS);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/admin-settings/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            setPermissions(data.permissions || {});
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
            localStorage.setItem(
              STORAGE_KEY_PERMISSIONS,
              JSON.stringify(data.permissions || {}),
            );
          }
        } else if (res.status === 401) {
          logout();
        }
      } catch (_) {
        // network error - keep offline stored user
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [token]);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin-settings/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        return {
          success: false,
          error: data.message || 'Identifiants invalides ou compte inactif.',
        };
      }

      const receivedUser: AdminUser = data.user;
      const receivedToken: string = data.token;
      const receivedPerms: Record<string, boolean> = data.permissions || {};

      setUser(receivedUser);
      setToken(receivedToken);
      setPermissions(receivedPerms);

      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(receivedUser));
      localStorage.setItem(STORAGE_KEY_TOKEN, receivedToken);
      localStorage.setItem(
        STORAGE_KEY_PERMISSIONS,
        JSON.stringify(receivedPerms),
      );

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return {
        success: false,
        error:
          err.message || 'Impossible de se connecter au serveur. Veuillez réessayer.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setPermissions({});
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_PERMISSIONS);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        permissions,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
