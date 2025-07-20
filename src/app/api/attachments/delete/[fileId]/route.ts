import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { getGridFSBucket } from '@/lib/gridfs';
import { Task } from '@/lib/models/Schema';
import dbConnect from '@/lib/mongoose';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {

  try {
    await dbConnect();


    const { fileId } = await params;



    const bucket = await getGridFSBucket();

    // Delete from GridFS (removes file and all chunks)
    await bucket.delete(new ObjectId(fileId));

    // Remove from task attachments array
    await Task.updateMany(
      { "attachments.fileId": new ObjectId(fileId) },
      { $pull: { attachments: { fileId: new ObjectId(fileId) } } }
    );

    return NextResponse.json({
      message: 'Attachment deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}