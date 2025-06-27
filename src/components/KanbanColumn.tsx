"use client";

import TaskCard, { type Task } from "./TaskCard";

interface KanbanColumnProps {
	title: string;
	tasks: Task[];
	onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

export default function KanbanColumn({
	title,
	tasks,
	onDragOver,
	onDrop,
}: KanbanColumnProps) {
	return (
		<div
			className="bg-gray-200 dark:bg-gray-700 rounded-md w-80 p-4 flex-shrink-0"
			onDragOver={onDragOver}
			onDrop={onDrop}
		>
			<h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
				{title} ({tasks.length})
			</h2>
			<div className="space-y-3">
				{tasks.map((task) => (
					<TaskCard key={task.id} task={task} />
				))}
			</div>
		</div>
	);
}
