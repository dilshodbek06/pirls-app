import apiClient from "@/lib/api-client";
import { User } from "@/lib/session";

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const response = await apiClient.get<{ user: User; success: boolean }>(
      "/api/auth/user"
    );

    if (response.data.success && response.data.user) {
      return response.data.user;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }
}
