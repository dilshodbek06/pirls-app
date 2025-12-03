import { NextResponse } from "next/server";
import { getUser } from "@/lib/user-server";

export async function GET() {
  try {
    const user = await getUser();

    return NextResponse.json(
      {
        success: true,
        user,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching user:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user",
        user: null,
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        },
      }
    );
  }
}
