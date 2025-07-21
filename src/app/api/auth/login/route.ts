import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Users } from "@/lib/models/Schema";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoose";

async function getUserByEmail(email: string) {
  await dbConnect();
  const user = Users.findOne({ email: email });
  return user;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { message: "User from that email does not exist" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        bio: user.bio,
      },
      process.env.JWT_SECRET
    );

    /// Set HTTP-only cookie
    const result = NextResponse.json(
      { email: user.email, name: user.name, role: user.role },
      { status: 200 }
    );

    result.cookies.set("access_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return result;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
