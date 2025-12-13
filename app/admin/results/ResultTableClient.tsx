/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ResultRow = {
  id: string;
  score: number;
  isCompleted: boolean;
  attemptNumber: number;
  createdAt: string;
  user: {
    fullName: string | null;
    email: string;
    province: string;
    region: string;
    schoolName: string;
  };
  passage: {
    title: string;
    grade: string;
    teacherName: string;
  };
};

const GRADE_LABELS: Record<string, string> = {
  GRADE_3: "3-sinf",
  GRADE_4: "4-sinf",
};

interface ResultTableClientProps {
  results: ResultRow[];
  totalAttempts: number;
}

function getUniqueOptions(results: ResultRow[], key: keyof ResultRow["user"]) {
  return Array.from(
    new Set(
      results
        .map((r) => r.user[key])
        .filter((val): val is string => Boolean(val && val.trim()))
    )
  ).sort((a, b) => a.localeCompare(b));
}

export default function ResultTableClient({
  results,
  totalAttempts,
}: ResultTableClientProps) {
  const [province, setProvince] = useState<string>("all");
  const [region, setRegion] = useState<string>("all");
  const [school, setSchool] = useState<string>("all");

  const provinceOptions = useMemo(
    () => getUniqueOptions(results, "province"),
    [results]
  );

  const regionOptions = useMemo(() => {
    const filtered =
      province === "all"
        ? results
        : results.filter((r) => r.user.province === province);
    return getUniqueOptions(filtered, "region");
  }, [province, results]);

  const schoolOptions = useMemo(() => {
    const filteredByProvince =
      province === "all"
        ? results
        : results.filter((r) => r.user.province === province);
    const filteredByRegion =
      region === "all"
        ? filteredByProvince
        : filteredByProvince.filter((r) => r.user.region === region);
    return getUniqueOptions(filteredByRegion, "schoolName");
  }, [province, region, results]);

  useEffect(() => {
    if (province !== "all" && !regionOptions.includes(region)) {
      setRegion("all");
    }
    if (school !== "all" && !schoolOptions.includes(school)) {
      setSchool("all");
    }
  }, [province, regionOptions, schoolOptions, region, school]);

  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      const provinceMatch =
        province === "all" || r.user.province === province || !r.user.province;
      const regionMatch =
        region === "all" || r.user.region === region || !r.user.region;
      const schoolMatch =
        school === "all" || r.user.schoolName === school || !r.user.schoolName;
      return provinceMatch && regionMatch && schoolMatch;
    });
  }, [province, region, results, school]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Barcha urinishlar</h2>
          <p className="text-sm text-muted-foreground">
            Viloyat, tuman yoki maktab bo‘yicha saralang
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Filter className="h-4 w-4" /> Filtrlar:
          </div>
          <Select value={province} onValueChange={setProvince}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Viloyat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha viloyatlar</SelectItem>
              {provinceOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={region}
            onValueChange={setRegion}
            disabled={province === "all" || !regionOptions.length}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Tuman" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha tumanlar</SelectItem>
              {regionOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={school}
            onValueChange={setSchool}
            disabled={
              province === "all" || region === "all" || !schoolOptions.length
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Maktab" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha maktablar</SelectItem>
              {schoolOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredResults.length ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  O‘quvchi
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Viloyat / Tuman / Maktab
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Matn
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  O‘qituvchi
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Ball
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Holat
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Sana
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result, index) => (
                <tr
                  key={result.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index === filteredResults.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">
                        {result.user.fullName ||
                          result.user.email ||
                          "Noma’lum"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {result.user.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex flex-col gap-1">
                      <span>
                        {result.user.province || "Viloyat belgilanmagan"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {(result.user.region || "Tuman belgilanmagan") +
                          " • " +
                          (result.user.schoolName || "Maktab belgilanmagan")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 line-clamp-1">
                        {result.passage.title}
                      </span>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                        {GRADE_LABELS[result.passage.grade] ||
                          result.passage.grade.replace("GRADE_", "") + "-sinf"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-800">
                      {result.passage.teacherName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-bold text-gray-900">
                      {result.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        result.isCompleted
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                      }`}
                    >
                      {result.isCompleted ? "Yakunlangan" : "Jarayonda"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-700">
                    {new Date(result.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-10 text-center text-gray-600">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold mb-3">
            <Award className="h-4 w-4" />
            Natija topilmadi
          </div>
          <p className="text-sm text-muted-foreground">
            Boshqa filtrni tanlab ko‘ring yoki barcha filtrlarni tozalang.
          </p>
        </div>
      )}

      <div className="border-t border-gray-200 px-6 py-4 text-sm text-gray-600 flex items-center justify-between">
        <span>
          Barcha urinishlar: <strong>{totalAttempts}</strong>
        </span>
        <span>
          Tanlangan filtr bo‘yicha: <strong>{filteredResults.length}</strong>
        </span>
      </div>
    </div>
  );
}
