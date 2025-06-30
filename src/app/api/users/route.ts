import { NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/models/Schema";
import dbConnect from "@/lib/mongoose";

export async function GET() {
	try {
		await dbConnect();
		const users = await User.find({});

		if (!users || users.length === 0) {
			return NextResponse.json({ error: "No users found" }, { status: 404 });
		}

		return NextResponse.json({
			data: users,
			message: "Users fetched successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ error: `Failed to fetch users: ${error}` },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		await dbConnect();
		const body = await request.json();

		const result = await User.create(body);

		return NextResponse.json({
			data: result,
			message: "User created successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ error: `Failed to create user: ${error}` },
			{ status: 500 },
		);
	}
}
