import Header from "@/components/Header";
import AdminBottomNav from "@/components/AdminBottomNav";
import { getUser } from "@/lib/user-server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, role } = await getUser();

  if (!isLoggedIn) {
    redirect("/auth/teacher-login");
  }

  if (role !== "ADMIN") {
    redirect("/");
  }

  return (
    <>
      <div className="bg-linear-to-r px-4 from-cyan-500 to-green-500">
        <Header />
      </div>

      <main className="pb-[5.1em]">{children}</main>
      <AdminBottomNav />
    </>
  );
}
