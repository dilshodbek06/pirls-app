"use client";

import { passages } from "@/mock/passagesData";
import PassageCard from "@/components/PassageCard";
import { BookOpen, Filter, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function TeacherPassages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<
    "all" | "Easy" | "Medium" | "Hard"
  >("all");

  const filteredPassages = passages.filter((passage) => {
    const matchesSearch =
      passage.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      passage.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "all" || passage.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <div className="container max-w-360 mx-auto px-4 py-12">
        {/* Header */}
        <div className="space-y-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Barcha matnlar
            </h1>
            <p className="text-gray-600">
              {filteredPassages.length} ta matn topildi
            </p>
          </div>

          {/* Search */}
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

          {/* Filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-600 shrink-0" />
            {(["all", "Easy", "Medium", "Hard"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setDifficultyFilter(level)}
                className={`px-4 py-2 rounded-full font-medium transition-all shrink-0 ${
                  difficultyFilter === level
                    ? "bg-blue-600 text-white"
                    : "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300"
                }`}
              >
                {level === "all" ? "Hammasi" : level}
              </button>
            ))}
          </div>
        </div>

        {/* Passages Grid */}
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
              {searchQuery || difficultyFilter !== "all"
                ? "Boshqa so'z yoki filterdan foydalanib ko'ring"
                : "Hali matni qo'shilmagan"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
