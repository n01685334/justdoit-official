import { NextRequest, NextResponse } from 'next/server';
import sanitize from 'sanitize-filename';
import { Readable } from 'stream';
import { getGridFSBucket } from '@/lib/gridfs';
import { Task } from '@/lib/models/Schema';
import dbConnect from '@/lib/mongoose';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const taskId = formData.get('taskId') as string;
    const userId = formData.get('userId') as string;


    if (!file || !taskId || !userId) {
      return NextResponse.json(
        { error: 'File, taskId, and userId are required' },
        { status: 400 }
      );
    }

    // Verify task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Sanitize filename
    const sanitizedFilename = sanitize(file.name);
    const timestamp = Date.now();
    const ext = sanitizedFilename.split('.').pop();
    const name = sanitizedFilename.replace(/\.[^/.]+$/, '');
    const finalFilename = `${name}-${timestamp}.${ext}`;

    // Get GridFS bucket
    const bucket = await getGridFSBucket();

    // Convert File to stream
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = Readable.from(buffer);

    // Upload to GridFS
    const uploadStream = bucket.openUploadStream(finalFilename, {
      metadata: {
        taskId,
        uploadedBy: userId,
        originalName: file.name,
        mimetype: file.type,
      }
    });


    // Pipe file to GridFS
    await new Promise((resolve, reject) => {
      stream.pipe(uploadStream)
        .on('error', reject)
        .on('finish', resolve);
    });

    const fileId = uploadStream.id;

    // Add attachment reference to task
    await Task.findByIdAndUpdate(taskId, {
      $push: {
        attachments: {
          fileId,
          filename: finalFilename,
          mimetype: file.type,
          size: file.size,
          uploadedBy: userId,
        }
      }
    });

    return NextResponse.json({
      message: 'File uploaded successfully',
      fileId: fileId.toString(),
      filename: finalFilename,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
