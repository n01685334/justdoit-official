"use client";

import { createContext, useContext, useState } from "react";
import type { UserResponse } from "@/types/api";

interface AuthContextType {
  user?: UserResponse;
  // loading: boolean;
  checkAuth?: () => Promise<boolean>;
  login?: (email: string, password: string) => Promise<void>;
  logout?: () => Promise<void>;
  signup?: (email: string, password: string, name: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserResponse | undefined>(undefined);

  const checkAuth = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const res = await response.json();
      throw new Error(res.message);
    }

    const userData = await response.json();
    setUser(userData);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "GET" });
    setUser(undefined);
  };

  const signup = async (email: string, password: string, name: string) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const res = await response.json();
      throw new Error(res.message);
    }

    const userData = await response.json();
    setUser(userData);
  };

  const contextValue = {
    user: user,
    // loading,
    // error,
    checkAuth,
    login,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
