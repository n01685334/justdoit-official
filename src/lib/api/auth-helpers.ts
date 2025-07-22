import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { JwtUser } from "@/types/types";

const { JWT_SECRET } = env;

export const isAuthenticated = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token");
  if (!access_token) {
    return false;
  }

  try {
    jwt.verify(access_token.value, JWT_SECRET);
    return true;
  } catch (err) {
    console.log("[ERROR] isAuthenticated: " + err);
    return false;
  }
};

export const getCurrentUser = async (): Promise<JwtUser | undefined> => {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token");
  if (!access_token) {
    return undefined;
  }

  try {
    const decoded = jwt.verify(access_token.value, JWT_SECRET) as JwtUser;
    return {
      _id: decoded._id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      bio: decoded.bio,
    };
  } catch (err) {
    console.log("Failed decoding token: " + err);
    return undefined;
  }
};
