"use client";

import { useProject } from "@/contexts/ProjectContext";
import { updateTask } from "@/lib/api/api-helpers";
import type { ProjectTask } from "@/types/api";
import { DropZone, TaskCard } from "./TaskCard";

interface KanbanColumnProps {
	title: string;
	tasks: ProjectTask[];
	columnId: string;
	onOpenCreateTaskModal: () => void;
	onOpenEditTaskModal: (task: ProjectTask) => void;
}

export default function KanbanColumn({
	title,
	tasks,
	columnId,
	onOpenCreateTaskModal,
	onOpenEditTaskModal,
}: KanbanColumnProps) {
	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	};
	const { dragState, setDragState, moveTaskToColumn } = useProject();
	const { draggedTaskId, fromColumnId, isDragging } = dragState;

	const showBottomDragZone = isDragging && fromColumnId !== columnId;

	const handleBottomDropZone = async () => {
		if (draggedTaskId && fromColumnId) {
			// Optimistic update
			moveTaskToColumn(draggedTaskId, fromColumnId, columnId, tasks.length);
			setDragState({
				isDragging: false,
				fromColumnId: null,
				draggedTaskId: null,
			});

			const { success } = await updateTask(draggedTaskId, {
				column: columnId,
				dropIndex: tasks.length,
			});

			if (!success) {
				// Revert optimistic update
				moveTaskToColumn(draggedTaskId, columnId, fromColumnId);
			}
		}
	};
	return (
		<li
			className="bg-gray-200 dark:bg-gray-700 rounded-md w-80 p-4 flex-shrink-0 list-none"
			onDragOver={handleDragOver}
		>
			<div className="flex gap-4">
				<h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
					{title} ({tasks.length})
				</h2>
				<button
					onClick={onOpenCreateTaskModal}
					type="button"
					className="ml-auto flex items-center justify-center w-9 h-9 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 text-lg font-medium"
				>
					+
				</button>
			</div>
			<ul className="space-y-3">
				{tasks.map((task) => (
					<TaskCard
						parentColumnId={columnId}
						key={task._id}
						task={task}
						onTaskClick={() => {
							onOpenEditTaskModal(task);
						}}
					/>
				))}
				{showBottomDragZone && (
					<DropZone onDrop={handleBottomDropZone} className="mt-4" />
				)}
			</ul>
		</li>
	);
}
