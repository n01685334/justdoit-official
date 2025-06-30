/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
"use client";

import { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { deleteTask, updateTask } from "@/lib/api/api-helpers";
import { type ProjectTask } from "@/types/api";

interface EditTaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	task: ProjectTask;
	currentColumnId: string | null;
}

export default function EditTaskModal({
	isOpen,
	onClose,
	task,
	currentColumnId,
}: EditTaskModalProps) {
	const {
		project,
		user,
		removeTask,
		setTaskLoading,
		moveTaskToColumn,
		updateTask: updateTaskContext,
	} = useProject();

	const [taskName, setTaskName] = useState(task.name);
	const [description, setDescription] = useState(task.description || "");
	const [selectedColumn, setSelectedColumn] = useState(currentColumnId);
	const [selectedTag, setSelectedTag] = useState(""); // TODO: Get from task.tags[0] if exists
	const [selectedAssignee, setSelectedAssignee] = useState(
		task.assignee?._id || "",
	);

	if (!project || !user) return null;

	const { columns, members, tags: projectTags } = project;

	const projectMembers = members.map((m) => m.user);

	const handleSubmit = async () => {
		if (!currentColumnId || !selectedColumn) return;
		onClose();

		const columnChanged = selectedColumn !== currentColumnId;
		setTaskLoading(task._id, true);

		if (columnChanged) {
			moveTaskToColumn(task._id, currentColumnId, selectedColumn);
		}

		const { success, error, data } = await updateTask(task._id, {
			name: taskName,
			description,
			column: selectedColumn,
			assignee: selectedAssignee,
			tag: selectedTag,
		});

		if (success && data) {
			updateTaskContext(task._id, data);
		} else {
			if (columnChanged) {
				moveTaskToColumn(task._id, selectedColumn, currentColumnId);
			}
			console.error(error);
		}

		setTaskLoading(task._id, false);
	};

	const handleDelete = async () => {
		console.log("deleting task....");
		try {
			const { success, error } = await deleteTask(task._id);

			if (error) {
				throw new Error(error);
			}

			if (success) {
				console.log("task deleted successfully");
				removeTask(task._id);
			}
		} catch (err) {
		} finally {
			onClose();
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
			<div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
				{/* Header */}
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
						Edit Task
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl"
					>
						✕
					</button>
				</div>

				{/* Form */}
				<div className="space-y-4">
					{/* Task Name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Task Name *
						</label>
						<input
							type="text"
							value={taskName}
							onChange={(e) => setTaskName(e.target.value)}
							placeholder="Enter task name"
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					{/* Description */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Description
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Enter task description"
							rows={3}
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
						/>
					</div>

					{/* Column Selection */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Column
						</label>
						{selectedColumn && (
							<select
								value={selectedColumn}
								onChange={(e) => setSelectedColumn(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								{columns.map((column) => (
									<option key={column._id} value={column._id}>
										{column.name}
									</option>
								))}
							</select>
						)}
					</div>

					{/* Row for Tag and Assignee */}
					<div className="grid grid-cols-2 gap-4">
						{/* Tag Selection */}
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Tag
							</label>
							<select
								value={selectedTag}
								onChange={(e) => setSelectedTag(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="">No tag</option>
								{projectTags.map((tag) => (
									<option key={tag._id} value={tag._id}>
										{tag.name}
									</option>
								))}
							</select>
						</div>

						{/* Assignee Selection */}
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Assignee
							</label>
							<select
								value={selectedAssignee}
								onChange={(e) => setSelectedAssignee(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="">Unassigned</option>
								{projectMembers.map((member) => (
									<option key={member._id} value={member._id}>
										{member.name}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

				{/* Actions */}
				<div className="flex justify-between mt-8">
					<button
						type="button"
						onClick={handleDelete}
						className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
					>
						Delete Task
					</button>

					<div className="flex gap-3">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleSubmit}
							disabled={!taskName.trim()}
							className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
						>
							Update Task
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
