import { NextRequest, NextResponse } from 'next/server';
import { Task, Users } from '@/lib/models/Schema';
import dbConnect from '@/lib/mongoose';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get all unique createdBy user IDs from tasks
    const taskUserIds = await Task.distinct('createdBy');

    // Get all existing user IDs
    const existingUserIds = await Users.distinct('_id');

    // Find user IDs that exist in tasks but not in users collection
    const orphanedUserIds = taskUserIds.filter(taskUserId =>
      !existingUserIds.some(userId => userId.toString() === taskUserId.toString())
    );

    // Get tasks with orphaned user IDs
    const orphanedTasks = await Task.find({
      createdBy: { $in: orphanedUserIds }
    }).select('_id name createdBy');

    return NextResponse.json({
      orphanedUserIds: orphanedUserIds.map(id => id.toString()),
      orphanedTasksCount: orphanedTasks.length,
      orphanedTasks: orphanedTasks
    });

  } catch (error) {
    console.error('Error finding orphaned tasks:', error);
    return NextResponse.json(
      { error: 'Failed to find orphaned tasks' },
      { status: 500 }
    );
  }
}