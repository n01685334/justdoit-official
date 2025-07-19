import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { Column, Comment, Project, Tag, Task, Users } from '@/lib/models/Schema';
import dbConnect from '@/lib/mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await mongoose.startSession();

  try {
    await dbConnect();

    const { userId } = await params;

    const results = {
      deletedProjects: [] as string[],
      updatedProjects: 0,
      deletedTasks: 0,
      updatedTasks: 0,
      deletedColumns: 0,
    };

    await session.withTransaction(async () => {
      // 1. Handle Projects
      const projectsToDelete = await Project.find({
        owner: userId
      }).select('_id').session(session);

      const deletedProjectIds = projectsToDelete.map(p => p._id);
      results.deletedProjects = deletedProjectIds.map(id => id.toString());

      await Project.deleteMany({
        owner: userId
      }).session(session);

      const memberUpdateResult = await Project.updateMany(
        { "members.user": userId },
        { $pull: { members: { user: userId } } }
      ).session(session);
      results.updatedProjects = memberUpdateResult.modifiedCount;

      // 2. Handle Tasks
      const taskDeleteResult1 = await Task.deleteMany({
        project: { $in: deletedProjectIds }
      }).session(session);

      const taskDeleteResult2 = await Task.deleteMany({
        createdBy: userId
      }).session(session);

      results.deletedTasks = taskDeleteResult1.deletedCount + taskDeleteResult2.deletedCount;

      const taskUpdateResult = await Task.updateMany(
        { assignee: userId },
        { $unset: { assignee: "" } }
      ).session(session);
      results.updatedTasks = taskUpdateResult.modifiedCount;

      // 3. Handle Columns
      const columnDeleteResult = await Column.deleteMany({
        project: { $in: deletedProjectIds }
      }).session(session);
      results.deletedColumns = columnDeleteResult.deletedCount;
    });

    return NextResponse.json({
      message: `Cleanup completed for user ${userId}`,
      results
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: 'Cleanup failed - transaction rolled back' },
      { status: 500 }
    );
  } finally {
    await session.endSession();
  }
}