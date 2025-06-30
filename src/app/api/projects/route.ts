import { type NextRequest, NextResponse } from "next/server";
import { Project } from "@/lib/models/Schema";
import dbConnect from "@/lib/mongoose";

export async function GET(request: NextRequest) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);

		const ownerId = searchParams.get("ownerId");

		// Build query
		const query: any = {};
		if (ownerId) {
			query.owner = ownerId;
		}

		const projects = await Project.find(query)
			.populate("owner", "name email")
			.populate("members.user", "name");

		return NextResponse.json({
			data: projects,
			message: "Projects fetched successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ error: `Failed to fetch projects: ${error}` },
			{ status: 500 },
		);
	}
}
