import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/api/auth-helpers";

export async function GET() {
	const user = await getCurrentUser()
	if(user){
		return NextResponse.json(user)
	}
	return NextResponse.json(
		{message: "User invalid/not found"},
		{status: 401}
	)
}