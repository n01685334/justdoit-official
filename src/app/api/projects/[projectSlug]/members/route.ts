import { NextRequest, NextResponse } from "next/server";
import { Project, Users } from "@/lib/models/Schema";
import dbConnect from "@/lib/mongoose";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  try {
    await dbConnect();
    const { projectSlug } = await params;
    const { email } = await request.json();

    const user = await Users.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const project = await Project.findOneAndUpdate(
      { slug: projectSlug },
      { $push: { members: { user: user._id, role: 'member' } } },
      { new: true }
    ).populate('members.user');

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ data: project.members, message: 'Member added' });
  } catch (err) {
    return NextResponse.json({ error: `Invite failed: ${err}` }, { status: 500 });
  }
}
