import { type NextRequest, NextResponse } from "next/server";
import { Column, Project, Tag } from "@/lib/models/Schema";
import dbConnect from "@/lib/mongoose";
import { getProjectBySlug } from "@/lib/api/api-helpers";

// Default columns for new projects
const DEFAULT_COLUMNS = [
	{ name: "Backlog", order: 0 },
	{ name: "WIP", order: 1 },
	{ name: "Done", order: 2 }
];

// Default tags for new projects
const DEFAULT_TAGS = [
	{ name: "High Priority", color: "#ef4444" },
	{ name: "Medium Priority", color: "#f59e0b" },
	{ name: "Low Priority", color: "#10b981" },
	{ name: "Bug", color: "#dc2626" },
	{ name: "Feature", color: "#3b82f6" }
];

const generateUniqueSlug = async (projectName: string) => {
	const baseSlug = projectName
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');

	let slug = baseSlug;
	let counter = 1;
	while (await Project.findOne({ slug })) {
		slug = `${baseSlug}-${counter}`;
		counter++;
	}

	return slug;
}

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

export async function POST(request: NextRequest) {
	try {
		await dbConnect();
		const body = await request.json();
		const { name, description, owner_id } = body;
		if (!name || !owner_id) {
			return NextResponse.json(
				{ error: "Name and ownerId are required" },
				{ status: 400 },
			);
		}

		const existingProject = await Project.findOne({
			name,
			owner: owner_id
		});

		if (existingProject) {
			return NextResponse.json(
				{ error: "A project with this name has already been created by you" },
				{ status: 400 },
			);
		};

		const uniqueSlug = await generateUniqueSlug(name);

		const newProject = new Project({
			name,
			description: description || "",
			owner: owner_id,
			members: [{ user: owner_id, role: "admin" }],
			slug: uniqueSlug,
		});

		const project = await newProject.save();

		// create default columns
		const columnPromises = DEFAULT_COLUMNS.map(col =>
			new Column({
				name: col.name,
				project: project._id,
				order: col.order,
			}).save()
		)

		const createdColumns = await Promise.all(columnPromises);

		// create default tags
		const tagPromises = DEFAULT_TAGS.map(tag =>
			new Tag({
				name: tag.name,
				color: tag.color,
				project: project._id,
			}).save()
		);

		const createdTags = await Promise.all(tagPromises);

		// update project with created columns and tags
		await Project.findByIdAndUpdate(
			project._id,
			{
				columns: createdColumns.map(col => col._id),
				tags: createdTags.map(tag => tag._id)
			},
			{ new: true }
		);

		return NextResponse.json({
			message: "Project created successfully",
			project_slug: project.slug,
		});

	} catch (error) {
		console.log("Error creating project:", error);
		return NextResponse.json(
			{ error: `Failed to create project: ${error}` },
			{ status: 500 },
		);
	}
}
