import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { getPassageById } from "@/actions/passage";
import PassageEditForm from "./PassageEditForm";

export const dynamic = "force-dynamic";

interface EditPassagePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPassagePage({ params }: EditPassagePageProps) {
  const session = await getSession();
  const user = session.user;

  if (!user || !user.isLoggedIn || (user.role !== "TEACHER" && user.role !== "ADMIN")) {
    redirect("/auth/login");
  }

  const { id } = await params;
  const passage = await getPassageById(id);

  if (!passage) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PassageEditForm passage={passage} />
    </div>
  );
}
