import { NextResponse } from "next/server";

export async function GET() {
    const res = NextResponse.json({status: 200})
    res.cookies.set("access_token", "", {httpOnly: true, expires: new Date(0)});
    return res
}