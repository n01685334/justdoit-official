import { UserResponse } from '@/types/api';
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";

export const isAuthenticated = async (): Promise<boolean>=> {
	const cookieStore = await cookies()
    const access_token = cookieStore.get('access_token')
    if(!access_token){
        return false
    }

    try {
        jwt.verify(access_token.value, process.env.JWT_SECRET);
        return true
    } catch(err) {
        console.log("[ERROR] isAuthenticated: " + err)
        return false
    }
}

export const getCurrentUser = async (): Promise<UserResponse | undefined> => {
    const cookieStore = await cookies()
    const access_token = cookieStore.get('access_token')
    if(!access_token){
        return undefined
    }

    try {
        const decoded = jwt.verify(access_token.value, process.env.JWT_SECRET);
        return {
            _id: decoded._id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role
        }
    } catch(err) {
        console.log("Failed decoding token: " + err)
        return undefined
    }
}