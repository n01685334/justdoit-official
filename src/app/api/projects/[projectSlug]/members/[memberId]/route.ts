import { NextRequest, NextResponse } from "next/server";
import { Project } from "@/lib/models/Schema";
import dbConnect from "@/lib/mongoose";

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ projectSlug: string; memberId: string }>;
  }
) {
  try {
    await dbConnect();
    const { projectSlug, memberId } = await params;
    const { role } = await request.json();

    const project = await Project.findOneAndUpdate(
      { slug: projectSlug, "members.user": memberId },
      { $set: { "members.$.role": role } },
      { new: true }
    ).populate("members.user");

    if (!project) {
      return NextResponse.json(
        { error: "Project or member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: project.members,
      message: "Member role updated",
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Update failed: ${err}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ projectSlug: string; memberId: string }>;
  }
) {
  try {
    await dbConnect();
    const { projectSlug, memberId } = await params;

    const project = await Project.findOneAndUpdate(
      { slug: projectSlug },
      { $pull: { members: { user: memberId } } },
      { new: true }
    ).populate("members.user");

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: project.members,
      message: "Member removed",
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Remove failed: ${err}` },
      { status: 500 }
    );
  }
}
