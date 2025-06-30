// mock-projects.ts
import { Types } from "mongoose";

// Mock user IDs
const userId1 = new Types.ObjectId();
const userId2 = new Types.ObjectId();
const userId3 = new Types.ObjectId();

// Mock project IDs
const projectId1 = new Types.ObjectId();
const projectId2 = new Types.ObjectId();

// Mock column IDs
const col1_1 = new Types.ObjectId();
const col1_2 = new Types.ObjectId();
const col1_3 = new Types.ObjectId();
const col2_1 = new Types.ObjectId();
const col2_2 = new Types.ObjectId();
const col2_3 = new Types.ObjectId();

// Mock task IDs
const task1_1 = new Types.ObjectId();
const task1_2 = new Types.ObjectId();
const task1_3 = new Types.ObjectId();
const task2_1 = new Types.ObjectId();
const task2_2 = new Types.ObjectId();

export const mockUsers = [
	{
		_id: userId1,
		googleId: "123456789",
		email: "john@example.com",
		name: "John Doe",
		avatar: "https://via.placeholder.com/150",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: userId2,
		googleId: "987654321",
		email: "jane@example.com",
		name: "Jane Smith",
		avatar: "https://via.placeholder.com/150",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: userId3,
		googleId: "456789123",
		email: "bob@example.com",
		name: "Bob Wilson",
		avatar: "https://via.placeholder.com/150",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

export const mockProjects = [
	{
		_id: projectId1,
		name: "E-commerce Website",
		description: "Building a modern e-commerce platform with React and Node.js",
		owner: userId1,
		members: [
			{ user: userId1, role: "admin" },
			{ user: userId2, role: "member" },
			{ user: userId3, role: "member" },
		],
		columns: [col1_1, col1_2, col1_3],
		tags: ["web", "react", "nodejs", "urgent"],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: projectId2,
		name: "Mobile App Development",
		description: "Cross-platform mobile app for task management",
		owner: userId2,
		members: [
			{ user: userId2, role: "admin" },
			{ user: userId1, role: "member" },
		],
		columns: [col2_1, col2_2, col2_3],
		tags: ["mobile", "react-native", "design"],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

export const mockColumns = [
	// Project 1 columns
	{
		_id: col1_1,
		name: "To Do",
		project: projectId1,
		order: 1,
		tasks: [task1_1],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: col1_2,
		name: "In Progress",
		project: projectId1,
		order: 2,
		tasks: [task1_2],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: col1_3,
		name: "Done",
		project: projectId1,
		order: 3,
		tasks: [task1_3],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	// Project 2 columns
	{
		_id: col2_1,
		name: "Backlog",
		project: projectId2,
		order: 1,
		tasks: [task2_1],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: col2_2,
		name: "Development",
		project: projectId2,
		order: 2,
		tasks: [task2_2],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: col2_3,
		name: "Testing",
		project: projectId2,
		order: 3,
		tasks: [],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

export const mockTasks = [
	// Project 1 tasks
	{
		_id: task1_1,
		name: "Setup project structure",
		description:
			"Initialize React project with TypeScript and configure build tools",
		project: projectId1,
		column: col1_1,
		assignee: userId2,
		createdBy: userId1,
		tags: ["setup", "typescript"],
		dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		completed: false,
		order: 1,
		attachments: [],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: task1_2,
		name: "Design product catalog",
		description: "Create wireframes and mockups for the product catalog page",
		project: projectId1,
		column: col1_2,
		assignee: userId3,
		createdBy: userId1,
		tags: ["design", "ui"],
		dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
		completed: false,
		order: 1,
		attachments: [],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: task1_3,
		name: "Setup database schema",
		description: "Define MongoDB collections and relationships",
		project: projectId1,
		column: col1_3,
		assignee: userId1,
		createdBy: userId1,
		tags: ["database", "mongodb"],
		dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
		completed: true,
		order: 1,
		attachments: [],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	// Project 2 tasks
	{
		_id: task2_1,
		name: "Research UI frameworks",
		description: "Compare React Native UI libraries and choose the best fit",
		project: projectId2,
		column: col2_1,
		assignee: userId1,
		createdBy: userId2,
		tags: ["research", "ui"],
		dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
		completed: false,
		order: 1,
		attachments: [],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: task2_2,
		name: "Implement authentication",
		description: "Add user login and registration functionality",
		project: projectId2,
		column: col2_2,
		assignee: userId2,
		createdBy: userId2,
		tags: ["auth", "security"],
		dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
		completed: false,
		order: 1,
		attachments: [],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

export const mockComments = [
	{
		_id: new Types.ObjectId(),
		content: "Great progress on this task! The TypeScript setup looks solid.",
		task: task1_1,
		author: userId1,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: new Types.ObjectId(),
		content:
			"I've added some initial wireframes. Please review when you get a chance.",
		task: task1_2,
		author: userId3,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];
