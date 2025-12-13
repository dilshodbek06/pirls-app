import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const Page = () => {
  return redirect("/admin/dashboard");
};

export default Page;
