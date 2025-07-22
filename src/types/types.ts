import { JwtPayload } from "jsonwebtoken";
import { Dispatch, SetStateAction } from "react";
import { ProjectResponse, ProjectTask, UserResponse } from "./api";

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

export type DragState = {
  draggedTaskId: string | null;
  fromColumnId: string | null;
  isDragging: boolean;
};

export type ProjectContextType = {
  project: ProjectResponse | null;
  user: UserResponse | null;
  isLoading: boolean;
  error: string | null;
  addTask: (columnId: string, newTask: ProjectTask) => void;
  updateTask: (taskId: string, updatedTask: ProjectTask) => void;
  moveTaskToColumn: (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
    dropIndex?: number
  ) => void;
  removeTask: (taskId: string) => void;
  setTaskLoading: (taskId: string, loading: boolean) => void;
  dragState: DragState;
  setDragState: Dispatch<SetStateAction<DragState>>;
  isOwner: boolean;
  inviteMember: (payload?: object) => Promise<void>;
  updateProject: (payload?: object) => Promise<void>;
};
