// lib/session.ts
import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

// Define the shape of your user/session data
export type User = {
  id: string;
  email: string;
  role: "ADMIN" | "USER" | "GUEST";
  isLoggedIn: boolean;
};

// Define the session data structure
export interface SessionData {
  user?: User;
}

export const sessionOptions: SessionOptions = {
  cookieName: "my_nextjs_session",
  password: process.env.SECRET_COOKIE_PASSWORD as string, // Must be 32 chars
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
