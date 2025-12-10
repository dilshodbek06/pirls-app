import { getAllPassages } from "@/actions/passage";
import PassageCard from "@/components/PassageCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

const Page = async () => {
  const passages = await getAllPassages();

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Top Section */}
      <div className="container max-w-360 mx-auto px-4 py-12 sm:py-16">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Barcha matnlar
          </h1>
          <Link href={"/admin/passages/create"}>
            <Button>+ yangi</Button>
          </Link>
        </div>

        <div className="space-y-6">
          {/* Passages Grid */}
          {passages.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {passages.map((passage) => (
                <PassageCard key={passage.id} passage={passage} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-600">
              Hali matnlar qo‘shilmagan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
