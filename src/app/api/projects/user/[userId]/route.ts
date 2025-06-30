import { NextRequest, NextResponse } from "next/server";
import { Project } from "@/lib/models/Schema";
import dbConnect from "@/lib/mongoose";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ userId: string }> },
) {
	try {
		await dbConnect();
		const { userId } = await params;

		// Projects owned by user
		const ownedProjects = await Project.find({ owner: userId })
			.populate("owner", "name email")
			.populate("members.user", "name")
			.populate("columns", "name order");

		// Projects where user is a member
		const memberProjects = await Project.find({
			"members.user": userId,
			owner: { $ne: userId },
		})
			.populate("owner", "name email")
			.populate("members.user", "name")
			.populate("columns", "name order");

		return NextResponse.json({
			data: {
				owner: ownedProjects,
				member: memberProjects,
			},
			message: "User projects fetched successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ error: `Failed to fetch user projects: ${error}` },
			{ status: 500 },
		);
	}
}
