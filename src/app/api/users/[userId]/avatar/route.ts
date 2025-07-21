import { NextRequest, NextResponse } from "next/server";
import { Users } from "@/lib/models/Schema";
import dbConnect from "@/lib/mongoose";
import { Readable } from "stream";
import { Types } from "mongoose";
import { getGridFSBucket } from "@/lib/gridfs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await params;
    const formData = await request.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bucket = await getGridFSBucket();
    const uploadStream = bucket.openUploadStream(file.name, {
      contentType: file.type,
    });

    const buffer = await file.arrayBuffer();
    const readable = new Readable();
    readable._read = () => {};
    readable.push(Buffer.from(buffer));
    readable.push(null);

    readable.pipe(uploadStream);

    await new Promise((resolve, reject) => {
      uploadStream.on("finish", resolve);
      uploadStream.on("error", reject);
    });

    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { avatar: uploadStream.id.toString() },
      { new: true }
    );

    return NextResponse.json({
      message: "Avatar uploaded successfully",
      avatarId: uploadStream.id.toString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Upload failed: ${err}` },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await params;
    const user = await Users.findById(userId);

    if (!user || !user.avatar) {
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
    }

    const bucket = await getGridFSBucket();
    const downloadStream = bucket.openDownloadStream(
      new Types.ObjectId(user.avatar)
    );

    const chunks: Buffer[] = [];
    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": downloadStream.s.contentType || "image/jpeg",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to fetch avatar: ${err}` },
      { status: 500 }
    );
  }
}
