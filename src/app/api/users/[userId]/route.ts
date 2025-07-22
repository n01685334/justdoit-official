import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";
import { Users } from "@/lib/models/Schema";
import dbConnect from "@/lib/mongoose";

export async function DELETE(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ userId: string }>;
  }
) {
  try {
    await dbConnect();
    const { userId: id } = await params;
    const result = await Users.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete user: ${error}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await params;
    const { name, bio } = await request.json();

    console.log("API received:", { userId, name, bio });
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { $set: { name, bio, updatedAt: Date.now() } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a new JWT token with updated user data
    const token = jwt.sign(
      {
        _id: updatedUser._id,
        name: updatedUser.name,
        bio: updatedUser.bio,
        email: updatedUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const result = NextResponse.json({ data: updatedUser, token });

    result.cookies.set("access_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return result;
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json(
      { error: `Update failed: ${err}` },
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
    const { userId: id } = await params;
    const user = await Users.findById(id);
    console.log(user);

    if (user === undefined || user == null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: user,
      message: "User fetched successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch user: ${error}` },
      { status: 500 }
    );
  }
}
