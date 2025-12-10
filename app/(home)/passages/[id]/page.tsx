import { getPassageById } from "@/actions/passage";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PassageDetailClient from "./PassageDetailClient";

export const dynamic = "force-dynamic";

export default async function PassagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const passage = await getPassageById(id);

  if (!passage) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="bg-linear-to-r px-4 from-cyan-500 to-green-500">
          <Header />
        </div>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Matn topilmadi</h2>
            <Link href="/passages">
              <Button>Matnlar ro&apos;yxatiga qaytish</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return <PassageDetailClient passage={passage} />;
}
