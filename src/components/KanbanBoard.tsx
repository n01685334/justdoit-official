"use client";

import { useState } from "react";
import { mockTasks } from "@/data/mock-tasks";
import Column from "./KanbanColumn";
import type { Task } from "./TaskCard";

const STATUS_OPTIONS = ["To Do", "In Progress", "In Review", "Done"] as const;

export default function KanbanBoard() {
	const [tasks, setTasks] = useState<Task[]>(mockTasks);

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	};

	const handleDrop = (
		e: React.DragEvent<HTMLDivElement>,
		newStatus: string,
	) => {
		e.preventDefault();
		const taskId = e.dataTransfer.getData("taskId");
		const fromStatus = e.dataTransfer.getData("fromStatus");
		if (!taskId || !fromStatus || fromStatus === newStatus) return;

		setTasks((prev) =>
			prev.map((t) =>
				t.id == taskId
					? {
							...t,
							status: newStatus,
						}
					: t,
			),
		);
	};

	return (
		<div className="w-full px-4 py-6 overflow-x-auto">
			<div className="flex space-x-4 min-w-[1000px]">
				{STATUS_OPTIONS.map((status) => {
					const tasksInColumn = tasks.filter((t) => t.status === status);
					return (
						<Column
							key={status}
							title={status}
							tasks={tasksInColumn}
							onDragOver={handleDragOver}
							onDrop={(e) => handleDrop(e, status)}
						/>
					);
				})}
			</div>
		</div>
	);
}
