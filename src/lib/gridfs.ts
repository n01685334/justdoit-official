import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongoose';

let bucket: GridFSBucket | null = null;

export async function getGridFSBucket(): Promise<GridFSBucket> {
  if (!bucket) {
    await dbConnect(); // Ensure connection is established
    
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }
    
    bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'attachments'
    });
  }
  return bucket;
}