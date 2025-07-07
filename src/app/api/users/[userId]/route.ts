import { type NextRequest, NextResponse } from "next/server";
import { Users } from "@/lib/models/Schema";
import dbConnect from "@/lib/mongoose";

export async function DELETE(
	_request: NextRequest,
	{
		params,
	}: {
		params: Promise<{ userId: string }>;
	},
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
			{ status: 500 },
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ userId: string }> },
) {
	try {
		await dbConnect();
		const { userId: id } = await params;
		const body = await request.json();

		const result = await Users.findByIdAndUpdate(id, body, { new: true });

		if (!result) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		return NextResponse.json({
			data: result,
			message: "User updated successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ error: `Failed to update user: ${error}` },
			{ status: 500 },
		);
	}
}

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ userId: string }> },
) {
	try {
		await dbConnect();
		const { userId: id } = await params;
		const user = await Users.findById(id);

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		return NextResponse.json({
			data: user,
			message: "User fetched successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ error: `Failed to fetch user: ${error}` },
			{ status: 500 },
		);
	}
}
