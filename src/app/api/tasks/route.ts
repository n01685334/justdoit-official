import { type NextRequest, NextResponse } from "next/server";
import { Column, Task } from "@/lib/models/Schema";
import dbConnect from "@/lib/mongoose";

export async function POST(request: NextRequest) {
	try {
		await dbConnect();

		const body = await request.json();
		const { name, description, project, column, assignee, tag, creator_id } =
			body;

		// Validate required fields
		if (!name || !project || !column) {
			return NextResponse.json(
				{ error: "Name, project, and column are required" },
				{ status: 400 },
			);
		}

		// Get the current highest order in the column to append new task
		const tasksInColumn = await Task.find({ column })
			.sort({ order: -1 })
			.limit(1);
		const nextOrder = tasksInColumn.length > 0 ? tasksInColumn[0].order + 1 : 0;

		// Create the task
		const task = await Task.create({
			name,
			description: description || "",
			project,
			column,
			assignee: assignee || null,
			tag,
			order: nextOrder,
			createdBy: creator_id, // Replace with actual user from session
			comments: [],
		});

		// Add task to column's tasks array
		await Column.findByIdAndUpdate(column, {
			$push: { tasks: task._id },
		});

		return NextResponse.json({
			message: "Task created successfully",
			created_task_id: task._id,
		});
	} catch (error) {
		return NextResponse.json(
			{ error: `Failed to create task: ${error}` },
			{ status: 500 },
		);
	}
}
