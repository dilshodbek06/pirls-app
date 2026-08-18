import { getUser } from "@/lib/user-server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (user && user.isLoggedIn) {
    if (user.role === "ADMIN") {
      redirect("/admin/dashboard");
    } else if (user.role === "TEACHER") {
      redirect("/teacher/dashboard");
    } else {
      redirect("/passages");
    }
  }

  return <>{children}</>;
}
