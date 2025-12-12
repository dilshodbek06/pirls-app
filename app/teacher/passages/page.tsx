import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session";
import PassageListClient from "./PassageListClient";

export const dynamic = "force-dynamic";

export default async function TeacherPassagesPage() {
  const session = await getSession();
  const user = session.user;

  if (!user || !user.isLoggedIn || user.role !== "TEACHER") {
    redirect("/auth/login");
  }

  const passages = await prisma.passage.findMany({
    include: { questions: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <div className="container max-w-360 mx-auto px-4 py-12">
        <PassageListClient passages={passages} />
      </div>
    </div>
  );
}
