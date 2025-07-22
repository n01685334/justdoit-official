import { JwtPayload } from "jsonwebtoken";
import { UserResponse } from "./api";

export type ProjectRole = "admin" | "member";

export interface User {
  google_id?: string;
  _id?: string;
  name: string;
  email: string;
  password?: string;
  __v?: number;
  avatar?: string;
  bio?: string;
  role: ProjectRole;
  lastActive?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JwtUser extends JwtPayload {
  _id: string,
  email: string,
  name: string,
  role: string,
  bio: string,
}
export interface AuthContextType {
  user?: UserResponse;
  checkAuth?: () => Promise<boolean>;
  login?: (email: string, password: string) => Promise<void>;
  logout?: () => Promise<void>;
  signup?: (email: string, password: string, name: string) => Promise<void>;
  updateUser?: (userData: Partial<UserResponse>) => Promise<void>;
}
