import { Attachment } from "@/components/TaskAttachments";
import { ProjectRole, User } from "./types";

/** biome-ignore-all lint/suspicious/noExplicitAny: allow arbitrary response types*/
export type ApiResponse<T = any> = {
  data?: T;
  error?: string;
  message?: string;
};

export type ApiError = {
  error: string;
  code?: string;
  details?: any;
};

export type CreateUserRequest = {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
};

export type UpdateUserRequest = {
  email?: string;
  name?: string;
  avatar?: string;
};

export type UserResponse = {
  google_id?: string;
  _id: string;
  name: string;
  email: string;
  __v?: number;
  role: ProjectRole;
  avatar?: string;
  rm;
  bio?: string;
  lastActive?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface ProjectTask {
  _id: string;
  name: string;
  description: string;
  assignee?: {
    _id: string;
    name: string;
  };
  comments: string[];
  commentCount?: number;
  attachments?: Attachment[];
  tag?: TagResponse;
}

export interface TagResponse {
  _id: string;
  name: string;
  color: string;
}

export type ProjectResponse = {
  _id: string;
  name: string;
  description: string;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  members: { user: { _id: string; name: string }; role: string }[];
  tags: { _id: string; name: string; color: string }[];
  columns: {
    _id: string;
    name: string;
    order: number;
    tasks: ProjectTask[];
  }[];
  createdAt: Date;
  updatedAt: Date;
  slug: string;
};

export type UserProjectsResponse = {
  owner: ProjectResponse[];
  member: ProjectResponse[];
};

export type TaskResponse = {
  _id: string;
  name: string;
  description: string;
  project: string;
  column: string;
  assignee?: {
    _id: string;
    name: string;
  };
  tags: {
    _id: string;
    name: string;
    color: string;
  }[];
  order: number;
  completed: boolean;
  comments: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type CommentResponse = {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
  };
  task: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface CreateTaskPayload {
  name: string;
  description: string;
  project: string;
  column?: string;
  assignee?: string | null;
  creator_id: string;
  tag?: string | null;
  dropIndex?: number;
}

export interface createProjectPayload {
  name: string;
  description?: string;
  owner_id: string;
}
