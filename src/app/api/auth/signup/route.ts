import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import env from "@/lib/env";
import { Users } from "@/lib/models/Schema";
import dbConnect from "@/lib/mongoose";
import { User } from "@/types/types";

const {
  JWT_SECRET
} = env;

async function createUser(email: string, password: string, name: string) {
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: User = {
    email: email,
    name: name,
    password: hashedPassword,
    role: "member"
  }

  await dbConnect()
  const result = await Users.create(newUser);

  return result
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Creating a user
    const user = await createUser(email, password, name)

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET
    )

    // Set HTTP-only cookie
    const result = NextResponse.json(
      { email: user.email, name: user.name, role: user.role },
      { status: 200 }
    )

    result.cookies.set('access_token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return result
  }
  catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Something unsual occured :(' },
      { status: 500 }
    );
  }
}