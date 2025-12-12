"use client";

import { useMemo, useState } from "react";
import { BookOpen, Filter, Search } from "lucide-react";
import PassageCard from "@/components/PassageCard";
import { Input } from "@/components/ui/input";
import type { FullPassage } from "@/types";
import type { Grade } from "@/lib/generated/prisma/enums";

type GradeFilter = "all" | Grade;

const GRADE_LABELS: Record<Grade, string> = {
  GRADE_3: "3-sinf",
  GRADE_4: "4-sinf",
};

interface PassageListClientProps {
  passages: FullPassage[];
}

export default function PassageListClient({
  passages,
}: PassageListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>("all");

  const gradeOptions: { value: GradeFilter; label: string }[] = useMemo(() => {
    const gradesInData = Array.from(
      new Set(passages.map((p) => p.grade))
    ) as Grade[];

    const sorted = gradesInData.sort();
    return [
      { value: "all", label: "Hammasi" },
      ...sorted.map((grade) => ({
        value: grade,
        label: GRADE_LABELS[grade] || grade,
      })),
    ];
  }, [passages]);

  const filteredPassages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return passages.filter((passage) => {
      const matchesSearch =
        query.length === 0 ||
        passage.title.toLowerCase().includes(query) ||
        passage.content.toLowerCase().includes(query);

      const matchesGrade =
        gradeFilter === "all" ? true : passage.grade === gradeFilter;

      return matchesSearch && matchesGrade;
    });
  }, [gradeFilter, passages, searchQuery]);

  return (
    <>
      <div className="space-y-6 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Barcha matnlar
          </h1>
          <p className="text-gray-600">{filteredPassages.length} ta matn</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Matni izlash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-base rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-0"
          />
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-600 shrink-0" />
          {gradeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setGradeFilter(option.value)}
              className={`px-4 py-2 rounded-full font-medium transition-all shrink-0 ${
                gradeFilter === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {filteredPassages.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPassages.map((passage) => (
            <PassageCard key={passage.id} passage={passage} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-gray-100 rounded-2xl p-6 mb-4">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Matni topilmadi
          </h3>
          <p className="text-gray-600">
            {searchQuery || gradeFilter !== "all"
              ? "Boshqa so'z yoki sinf filteridan foydalanib ko'ring"
              : "Hali matn qo'shilmagan"}
          </p>
        </div>
      )}
    </>
  );
}
