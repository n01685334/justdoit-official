"use client";

import { createContext, useContext, useState } from "react";
import type { UserResponse } from "@/types/api";

interface AuthContextType {
  user?: UserResponse;
  checkAuth?: () => Promise<boolean>;
  login?: (email: string, password: string) => Promise<void>;
  logout?: () => Promise<void>;
  signup?: (email: string, password: string, name: string) => Promise<void>;
  updateUser?: (userData: Partial<UserResponse>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({});

export const AuthProvider = ({ userData, children }: { userData: UserResponse | undefined, children: React.ReactNode }) => {
  const [user, setUser] = useState<UserResponse | undefined>(userData);

  const checkAuth = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return true;
      }
      return false;
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

  const updateUser = async (userData: Partial<UserResponse>) => {
    if (!user?._id) throw new Error("User not authenticated");
    console.log("Updating user with:", userData);
    const response = await fetch(`/api/users/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const res = await response.json();
      throw new Error(res.message || "Update failed");
    }

    const updatedUser = await response.json();
    setUser(updatedUser.data);
  };

  const contextValue = {
    user,
    checkAuth,
    login,
    logout,
    signup,
    updateUser,
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