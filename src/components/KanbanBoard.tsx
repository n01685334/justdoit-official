"use client";

import { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { ProjectTask } from "@/types/api";
import CreateTaskModal from "./CreateTaskModal";
import EditTaskModal from "./EditTaskModal";
import Column from "./KanbanColumn";

export default function KanbanBoard() {
	const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
	const [currentSelectedColumn, setCurrentSelectedColumn] = useState<
		string | null
	>(null);

	const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
	const [currentEditingTask, setCurrentEditingTask] =
		useState<ProjectTask | null>(null);

	const { project } = useProject();

	// FIXME: temp type safety
	if (!project) return null;

	const { columns } = project;

	const createTaskModalProps = {
		projectMembers: project.members.map((m) => m.user),
		projectTags: project.tags,
		columns,
	};

	const handleCloseNewTaskModal = () => {
		setIsCreateTaskModalOpen(false);
	};

	const handleOpenNewTaskModal = (initialSelectedColumnId: string) => {
		setCurrentSelectedColumn(initialSelectedColumnId);
		setIsCreateTaskModalOpen(true);
	};

	const handleCloseEditTaskModal = () => {
		setIsEditTaskModalOpen(false);
		setCurrentEditingTask(null);
	};

	const handleOpenEditTaskModal = (
		initialSelectedColumnId: string,
		task: ProjectTask,
	) => {
		setCurrentSelectedColumn(initialSelectedColumnId);
		setCurrentEditingTask(task);
		setIsEditTaskModalOpen(true);
	};

	return (
		<>
			<div className="w-full px-4 py-6 overflow-x-auto">
				<ul className="flex space-x-4 min-w-[1000px]">
					{columns?.map((col) => {
						// const tasksInColumn = tasks.filter((t) => t.status === status);
						const tasks = col.tasks;
						return (
							<Column
								key={col._id}
								columnId={col._id}
								title={col.name}
								tasks={tasks}
								// onTaskDrop={handleTaskDrop}
								onOpenCreateTaskModal={() => {
									handleOpenNewTaskModal(col._id);
								}}
								onOpenEditTaskModal={(task: ProjectTask) => {
									handleOpenEditTaskModal(col._id, task);
								}}
							/>
						);
					})}
				</ul>
			</div>
			{isCreateTaskModalOpen && (
				<CreateTaskModal
					key={currentSelectedColumn}
					isOpen={isCreateTaskModalOpen}
					onClose={handleCloseNewTaskModal}
					currentColumnId={currentSelectedColumn}
					{...createTaskModalProps}
				/>
			)}
			{currentEditingTask && (
				<EditTaskModal
					key={currentSelectedColumn || "edit-task-modal"}
					isOpen={isEditTaskModalOpen}
					onClose={handleCloseEditTaskModal}
					currentColumnId={currentSelectedColumn}
					task={currentEditingTask}
				/>
			)}
		</>
	);
}
