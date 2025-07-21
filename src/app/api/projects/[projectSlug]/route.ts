import { type NextRequest, NextResponse } from "next/server";
import { cascadeDeleteProject } from "@/lib/api/api-helpers";
import { Project } from "@/lib/models/Schema";
import dbConnect from "@/lib/mongoose";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
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
          select: "name description order attachments",
          options: { sort: { order: 1 } },
          populate: [
            {
              path: "assignee",
              select: "name",
            },
            {
              path: "tag",
              select: "name color",
            },
            {
              path: "comments",
              select: "_id",
            },
          ],
        },
      });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: project,
      message: "User fetched successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch project: ${error}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  try {
    await dbConnect();
    const { projectSlug } = await params;
    const { name, description } = await request.json();

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;

    const updated = await Project.findOneAndUpdate(
      { slug: projectSlug },
      updateData,
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ data: updated, message: "Project updated" });
  } catch (err) {
    return NextResponse.json(
      { error: `Update failed: ${err}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  try {
    await dbConnect();
    const { projectSlug: slug } = await params;
    const project = await Project.findOne({ slug });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await cascadeDeleteProject(project._id.toString());
    await project.deleteOne();

    return NextResponse.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete project: ${error}` },
      { status: 500 }
    );
  }
}
