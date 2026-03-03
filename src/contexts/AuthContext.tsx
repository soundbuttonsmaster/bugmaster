import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "@/lib/auth";
import type { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  adminLogin: (email: string, password: string) => Promise<void>;
  userLogin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (authApi.isAuthenticated()) {
      try {
        const profile = await authApi.getProfile();
        setUser(profile);
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_email");
        localStorage.removeItem("is_admin");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (authApi.isAuthenticated()) {
      refreshProfile()
        .catch(() => setUser(null))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [refreshProfile]);

  const adminLogin = async (email: string, password: string) => {
    const res = await authApi.adminLogin({ email, password });
    setUser(res.user);
  };

  const userLogin = async (email: string, password: string) => {
    const res = await authApi.userLogin({ email, password });
    setUser(res.user);
  };

  const logout = async () => {
    if (authApi.isAdmin()) {
      await authApi.adminLogout();
    } else {
      await authApi.userLogout();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user || authApi.isAuthenticated(),
        isLoading,
        isAdmin: user?.profile?.is_admin ?? authApi.isAdmin(),
        adminLogin,
        userLogin,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
