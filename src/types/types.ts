export type ProjectRole = "admin" | "member";

export interface User {
  google_id?: string;
  _id?: string;
  name: string;
  email: string;
  password: string;
  __v?: number;
  avatar?: string;
  bio?: string;
  role: ProjectRole;
  lastActive?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
