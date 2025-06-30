"use client";

import { createContext, useContext } from "react";
import { useFetch } from "@/hooks/useFetch";
import type { UserResponse } from "@/types/api";

interface AuthContextType {
	user?: UserResponse;
	// loading: boolean;
	login?: (email: string, password: string) => Promise<void>;
	logout?: () => Promise<void>;
	signup?: (email: string, password: string, name: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({});

const DEFAULT_USER_ID = "";

export const AuthProvider = ({
	userData,
	children,
}: {
	userData: UserResponse;
	children: React.ReactNode;
}) => {
	// temporary user data fetching for development
	const defaultUser = `/api/users/${DEFAULT_USER_ID}`;
	// const {
	// 	data: userData,
	// 	loading,
	// 	error,
	// } = useFetch<UserResponse>(defaultUser, [DEFAULT_USER_ID]);

	// TODO: replace with real auth check
	const checkAuth = async () => {
		try {
			const response = await fetch("/api/auth/me");
			if (response.ok) {
				const userData = await response.json();
				// setUser(userData);
			}
		} catch (error) {
			console.error("Auth check failed:", error);
		} finally {
			// setLoading(false);
		}
	};

	// TODO: replace with real login code.
	const login = async (email: string, password: string) => {
		const response = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			throw new Error("Login failed");
		}

		const userData = await response.json();
		// setUser(userData);
	};

	// TODO: replace with real logout code.
	const logout = async () => {
		await fetch("/api/auth/logout", { method: "POST" });
		// setUser(null);
	};

	// TODO: replace with real signup code.
	const signup = async (email: string, password: string, name: string) => {
		const response = await fetch("/api/auth/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password, name }),
		});

		if (!response.ok) {
			throw new Error("Signup failed");
		}

		const userData = await response.json();
		// setUser(userData);
	};

	const contextValue = {
		user: userData,
		// loading,
		// error,
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
