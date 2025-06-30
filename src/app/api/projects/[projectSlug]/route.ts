import { type NextRequest, NextResponse } from "next/server";
import { Project } from "@/lib/models/Schema";
import dbConnect from "@/lib/mongoose";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ projectSlug: string }> },
) {
	try {
		await dbConnect();
		const { projectSlug: slug } = await params;
		const project = await Project.findOne({ slug })
			.populate("owner", "name email")
			.populate("members.user", "name")
			.populate("tags", "name color")
			.populate({
				path: "columns",
				select: "name order tasks",
				options: { sort: { order: 1 } },
				populate: {
					path: "tasks",
					select: "name description comments order",
					options: { sort: { order: 1 } },
					populate: {
						path: "assignee",
						select: "name",
					},
				},
			});

		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		// console.log(JSON.stringify(project, null, 2));

		return NextResponse.json({
			data: project,
			message: "User fetched successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ error: `Failed to fetch project: ${error}` },
			{ status: 500 },
		);
	}
}
