// lib/session.ts
import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

// Define the shape of your user/session data
export type User = {
  id: string;
  email: string;
  role: "ADMIN" | "USER" | "GUEST" | "TEACHER";
  isLoggedIn: boolean;
  fullName: string;
  province: string;
  region: string;
  schoolName: string;
};

// Define the session data structure
export interface SessionData {
  user?: User;
}

export const sessionOptions: SessionOptions = {
  cookieName: "my_nextjs_session",
  password: (() => {
    const secret = process.env.SECRET_COOKIE_PASSWORD;
    if (!secret || secret.length < 32) {
      throw new Error(
        "SECRET_COOKIE_PASSWORD env is missing or shorter than 32 characters."
      );
    }
    return secret;
  })(),
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    httpOnly: true, // Important for security
  },
};

// Extend IronSessionData for type safety
declare module "iron-session" {
  type IronSessionData = SessionData;
}

export function getSessionOptions(): SessionOptions {
  return sessionOptions;
}

export async function getSession() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  return session;
}
