import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { getGridFSBucket } from '@/lib/gridfs';
import dbConnect from '@/lib/mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    await dbConnect();
    
    const { fileId } = await params;
    const bucket = await getGridFSBucket();
    
    const file = await bucket.find({ _id: new ObjectId(fileId) }).next();
    if (!file) {
      console.log('No file found with ID:', fileId);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
    
    const chunks: Buffer[] = [];

    return new Promise<NextResponse>((resolve, reject) => {
      downloadStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      downloadStream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        
        const response = new NextResponse(buffer, {
          headers: {
            'Content-Type': file.metadata?.mimetype || 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${file.filename}"`,
            'Content-Length': buffer.length.toString(),
          },
        });
        
        resolve(response);
      });

      downloadStream.on('error', (error) => {
        console.error('Stream error:', error);
        reject(NextResponse.json({ error: 'Download failed' }, { status: 500 }));
      });
    });
    
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}