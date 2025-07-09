import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export const isAuthenticated = async (): Promise<boolean>=> {
	const cookieStore = await cookies()
    const access_token = cookieStore.get('access_token')
    if(!access_token){
        return false
    }

    try {
        const decoded = jwt.verify(access_token.value, process.env.JWT_SECRET);
        return true
    } catch(err) {
        return false
    }
}

export const getCurrentUser = async () => {
    const cookieStore = await cookies()
    const access_token = cookieStore.get('access_token')
    if(!access_token){
        return null
    }

    try {
        const decoded = jwt.verify(access_token.value, process.env.JWT_SECRET);
        return decoded
    } catch(err) {
        console.log("Failed decoding token: " + err)
        return null
    }
}