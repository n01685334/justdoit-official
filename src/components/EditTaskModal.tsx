/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
"use client";

import { useEffect, useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { addComment, deleteCommentById, deleteTask, getCommentsById, updateTask } from "@/lib/api/api-helpers";
import { CommentResponse, type ProjectTask } from "@/types/api";
import HeaderUserMenu from "./HeaderUserMenu";
import TaskAttachments from "./TaskAttachments";

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
	const [selectedTag, setSelectedTag] = useState(task.tag?._id || "");
	const [selectedAssignee, setSelectedAssignee] = useState(
		task.assignee?._id || "",
	);
	const [userComment, setUserComment] = useState("")
	const [comments, setComments] = useState<CommentResponse[]>([])
	const [loading, setLoading] = useState(true)

  // TODO: fix useeffect
	useEffect(() => {
		refreshComments();
	} , [])

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
			console.log(err)
		} finally {
			onClose();
		}
	};

	const refreshComments = async () => {
		const res = await getCommentsById(task._id)
		if(res.data !== undefined){
			setComments(res.data)
		}
		setLoading(false)
	}

	const handleComment = async () => {
		if(user._id){
			const res = await addComment(userComment, task._id, user._id)
			if(res.success){
				setUserComment("")
				refreshComments()
			}
		}
	}

	const handleDeleteComment = async (commentId: string) => {
		const res = await deleteCommentById(task._id, commentId)
		if(res.success){
			refreshComments()
		}
	}

	const getFormattedDate = (date: Date) => {
		const formatted = new Date(date)
		return formatted.toDateString()
	}

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
			<div className="grid grid-cols-2">
			{/* Task Modal */}
			<div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
				{/* Header */}
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
						Edit Task
					</h2>
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
          {/* Task Attachments */}
          <TaskAttachments userId={user._id ?? ""} taskId={task._id}/>
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
			{/* End of task modal div */}

			{/* Comments modal Div */}
			<div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
						Comments
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl"
					>
						✕
					</button>
				</div>

				{/* Add a comment */}
				<div className="space-y-4">
					<div>
						<div className="flex flex-row gap-2">
							<HeaderUserMenu user={user} />
							<input
								type="text"
								value={userComment}
								onChange={(e) => setUserComment(e.target.value)}
								placeholder="Enter your comment"
								id="tComment"
								className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<button
							type="button"
							onClick={handleComment}
							disabled={userComment.trim().length <= 0 ? true : false}
							className={userComment.trim().length <= 0 ? "bg-gray-600 p-2 px-3 rounded-md my-2" : "bg-green-600 hover:bg-green-800 dark:hover:bg-green-400 p-2 px-3 rounded-md my-2"}
						>
							Comment
						</button>
					</div>
				</div>

				{/* Showing all comments */}
				{loading && <div>Loading...</div>}
				{ comments.length > 0 && 
				<div className="overflow-y-auto h-90 pr-4">
					{
						comments.toReversed().map(comment => 
							<div key={comment._id} className="p-2 px-4 my-2 bg-gray-900 rounded-md">
								<div className="flex justify-between mb-2">
									<div>
									<span className="font-bold text-md">{comment.author[0].name}</span>
									<span className="italic text-sm ml-2 text-gray-400">{getFormattedDate(comment.createdAt)}</span>
									</div>

									{ comment.author[0]._id === user._id &&
									<div>
										<button
											type="button"
											onClick={() => {handleDeleteComment(comment._id)}}
										>
											🗑️
										</button>
									</div>
									}
								</div>
								<div>
									╰ {comment.content}
								</div>
							</div>
						)
					}
				</div>
				}
			</div>
			{/* End of comments div */}
			</div>
		</div>
	);
}
