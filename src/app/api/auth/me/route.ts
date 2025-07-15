import { getCurrentUser } from "@/lib/api/auth-helpers";

export async function GET() {
	return await getCurrentUser()
}