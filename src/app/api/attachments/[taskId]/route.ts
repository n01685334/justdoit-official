import { NextRequest, NextResponse } from 'next/server';
import { Task } from '@/lib/models/Schema';
import dbConnect from '@/lib/mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    await dbConnect();
    
    const { taskId } = await params;
    
    const task = await Task.findById(taskId).select('attachments');

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      attachments: task.attachments || []
    });

  } catch (error) {
    console.error('Get attachments error:', error);
    return NextResponse.json(
      { error: 'Failed to get attachments' },
      { status: 500 }
    );
  }
}
