export type ProjectRole = "admin" | "member";

export interface User {
	google_id?: string;
	_id?: string;
	name: string;
	email: string;
	role: ProjectRole;
	lastActive?: Date;
	createdAt?: Date;
	updatedAt?: Date;
}
