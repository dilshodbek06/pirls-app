import { getSession, User } from "./session";

export async function getUser(): Promise<
  User | { isLoggedIn: false; role: "GUEST" }
> {
  const session = await getSession();

  if (session.user?.isLoggedIn) {
    // Return session data (could optionally refresh from DB here)
    return session.user;
  }

  // Default guest state
  return { isLoggedIn: false, role: "GUEST" };
}
