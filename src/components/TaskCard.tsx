"use client";

import { useState } from "react";
import TaskDetailModal from "./TaskModal";

interface User {
	id: string;
	name: string;
	initials: string;
	colorIndex: number;
}

export interface Task {
	id: string;
	title: string;
	description: string;
	categoryId: number;
	status: string;
	assignee?: User;
	comments?: {
		id: string;
		text: string;
		user: User;
	}[];
}
// Color palettes
const categoryColors = [
	"bg-blue-900/30",
	"bg-green-900/30",
	"bg-yellow-900/30",
	"bg-pink-900/30",
	"bg-purple-900/30",
	"bg-indigo-900/30",
	"bg-red-900/30",
	"bg-orange-900/30",
	"bg-teal-900/30",
	"bg-cyan-900/30",
];

export const userColors = [
	"bg-blue-600",
	"bg-green-600",
	"bg-yellow-600",
	"bg-pink-600",
	"bg-purple-600",
	"bg-indigo-600",
	"bg-red-600",
	"bg-orange-600",
	"bg-teal-600",
	"bg-cyan-600",
];

export default function TaskCard({ task }: { task: Task }) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
		e.dataTransfer.setData("taskId", task.id);
		e.dataTransfer.setData("fromStatus", task.status);
		e.dataTransfer.effectAllowed = "move";
	};
	return (
		<>
			<div
				className={`${categoryColors[task.categoryId]} rounded-md border border-gray-700 p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow max-w-80`}
				draggable
				onDragStart={handleDragStart}
				onClick={() => setIsModalOpen(true)}
			>
				<div className="flex justify-between items-start">
					<h3 className="text-lg font-medium text-blue-400">{task.title}</h3>
					{task.assignee && (
						<div
							className={`${userColors[task.assignee.colorIndex]} w-8 h-8 rounded-full flex items-center justify-center text-white font-medium`}
						>
							{task.assignee.initials}
						</div>
					)}
				</div>
				<p className="mt-2 text-sm text-gray-400 line-clamp-2">
					{task.description}
				</p>
			</div>

			{isModalOpen && (
				<TaskDetailModal task={task} onClose={() => setIsModalOpen(false)} />
			)}
		</>
	);
}
