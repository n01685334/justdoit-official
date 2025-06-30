// models/User.ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	googleId: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	avatar: { type: String }, // Google profile picture URL
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);

const projectSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String },
	owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	members: [
		{
			_id: false,
			user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
			role: { type: String, enum: ["admin", "member"], default: "member" },
		},
	],
	columns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Column" }],
	tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	slug: { type: String, required: true, unique: true },
});

export const Project =
	mongoose.models.Project || mongoose.model("Project", projectSchema);

// models/Column.ts

const columnSchema = new mongoose.Schema({
	name: { type: String, required: true },
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Project",
		required: true,
	},
	order: { type: Number, required: true }, // For column ordering
	tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export const Column =
	mongoose.models.Column || mongoose.model("Column", columnSchema);

// models/Task.ts

const taskSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String },
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Project",
		required: true,
	},
	column: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Column",
		required: true,
	},
	assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	tag: { type: mongoose.Schema.Types.ObjectId, ref: "Tag" },
	dueDate: { type: Date },
	completed: { type: Boolean, default: false },
	order: { type: Number, required: true }, // For task ordering within column
	attachments: [
		{
			filename: { type: String, required: true },
			data: { type: Buffer, required: true }, // Store file as Buffer
			mimetype: { type: String, required: true },
			size: { type: Number, required: true },
			uploadedAt: { type: Date, default: Date.now },
		},
	],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

taskSchema.virtual("commentCount").get(function () {
	return this.comments ? this.comments.length : 0;
});

export const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

// models/Comment.ts

const commentSchema = new mongoose.Schema({
	content: { type: String, required: true },
	task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export const Comment =
	mongoose.models.Comment || mongoose.model("Comment", commentSchema);

const tagSchema = new mongoose.Schema({
	name: { type: String, required: true },
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Project",
		required: true,
	},
	color: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export const Tag = mongoose.models.Tag || mongoose.model("Tag", tagSchema);
