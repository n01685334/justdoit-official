import { type NextRequest, NextResponse } from "next/server";
import { Column, Task } from "@/lib/models/Schema";
import dbConnect from "@/lib/mongoose";
import { TASK_ORDER_INCREMENT, TASK_ORDER_MIN_GAP } from "@/lib/vars/constants";
import type { CreateTaskPayload } from "@/types/api";

export async function DELETE(
	_request: NextRequest,
	{
		params,
	}: {
		params: Promise<{ taskId: string }>;
	},
) {
	try {
		await dbConnect();
		const { taskId } = await params;

		// Find the task to get its column
		const task = await Task.findById(taskId);
		if (!task) {
			return NextResponse.json({ error: "Task not found" }, { status: 404 });
		}

		// Remove task from column
		await Column.findByIdAndUpdate(task.column, {
			$pull: { tasks: taskId },
		});

		// Delete the task
		await Task.findByIdAndDelete(taskId);

		return NextResponse.json({
			message: "Task deleted successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ error: `Failed to delete task: ${error}` },
			{ status: 500 },
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ taskId: string }> },
) {
	try {
		await dbConnect();
		const { taskId } = await params;
		const body = await request.json();
		const { name, description, column, assignee, tag, dropIndex } = body;

		const currentTask = await Task.findById(taskId);
		if (!currentTask) {
			return NextResponse.json({ error: "Task not found" }, { status: 404 });
		}

		const oldColumnId = currentTask.column.toString();
		const newColumnId = column;

		const updateFields: Partial<CreateTaskPayload> & {
			updatedAt: Date;
			order?: number;
		} = {
			updatedAt: new Date(),
		};

		if (name) updateFields.name = name;
		if (description) updateFields.description = description;
		if (assignee) updateFields.assignee = assignee;
		if (tag) updateFields.tag = tag;

		// Handle order and column changes
		if (column !== undefined) {
			updateFields.column = column;

			if (dropIndex !== undefined) {
				// Get tasks in target column, sorted by order (excluding current task if same column)
				const query =
					oldColumnId === newColumnId
						? { column, _id: { $ne: taskId } }
						: { column };
				const tasksInColumn = await Task.find(query).sort({ order: 1 });

				console.log("=== ORDER CALCULATION DEBUG ===");
				console.log("dropIndex:", dropIndex);
				console.log("tasksInColumn count:", tasksInColumn.length);
				console.log(
					"tasksInColumn orders:",
					tasksInColumn.map((t) => ({ id: t._id, order: t.order })),
				);

				let newOrder: number;
				if (dropIndex === 0) {
					// Insert at beginning
					newOrder =
						tasksInColumn.length > 0
							? tasksInColumn[0].order - TASK_ORDER_INCREMENT
							: TASK_ORDER_INCREMENT;
					console.log("Insert at beginning, newOrder:", newOrder);
				} else if (dropIndex >= tasksInColumn.length) {
					// Insert at end
					newOrder =
						tasksInColumn.length > 0
							? tasksInColumn[tasksInColumn.length - 1].order +
								TASK_ORDER_INCREMENT
							: TASK_ORDER_INCREMENT;
					console.log("Insert at end, newOrder:", newOrder);
				} else {
					// Insert between tasks
					const prevOrder = tasksInColumn[dropIndex - 1].order;
					const nextOrder = tasksInColumn[dropIndex].order;
					const gap = nextOrder - prevOrder;
					console.log(
						"Insert between - prevOrder:",
						prevOrder,
						"nextOrder:",
						nextOrder,
						"gap:",
						gap,
					);

					if (gap < TASK_ORDER_MIN_GAP) {
						console.log("Gap too small, shifting subsequent tasks");
						await Task.updateMany(
							{ column, order: { $gte: nextOrder }, _id: { $ne: taskId } },
							{ $inc: { order: TASK_ORDER_INCREMENT } },
						);
						newOrder = nextOrder;
					} else {
						newOrder = Math.floor((prevOrder + nextOrder) / 2);
					}
					console.log("Insert between, newOrder:", newOrder);
				}

				updateFields.order = newOrder;
				console.log("Final updateFields.order:", updateFields.order);
			}
		}

		const updatedTask = await Task.findByIdAndUpdate(taskId, updateFields, {
			new: true,
		})
			.populate("assignee", "name")
			.populate("tag", "name color");

		// Update column references if column changed
		if (oldColumnId !== newColumnId) {
			await Column.findByIdAndUpdate(oldColumnId, { $pull: { tasks: taskId } });
			await Column.findByIdAndUpdate(newColumnId, { $push: { tasks: taskId } });
		}

		return NextResponse.json({
			message: "Task updated successfully",
			data: updatedTask,
		});
	} catch (error) {
		return NextResponse.json(
			{ error: `Failed to update task: ${error}` },
			{ status: 500 },
		);
	}
}
