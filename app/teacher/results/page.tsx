import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Award,
  BarChart3,
  BookOpen,
  MapPin,
  Target,
  Users,
} from "lucide-react";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

const GRADE_LABELS: Record<string, string> = {
  GRADE_3: "3-sinf",
  GRADE_4: "4-sinf",
};

function formatDate(date: Date) {
  return date.toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function TeacherResults() {
  const session = await getSession();
  const user = session.user;

  if (!user || !user.isLoggedIn || user.role !== "TEACHER") {
    redirect("/auth/login");
  }

  const locationFilter = {
    ...(user.province ? { province: user.province } : {}),
    ...(user.region ? { region: user.region } : {}),
    ...(user.schoolName ? { schoolName: user.schoolName } : {}),
  };

  const results = await prisma.result.findMany({
    where: {
      user: { role: "USER", ...locationFilter },
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          province: true,
          region: true,
          schoolName: true,
        },
      },
      passage: {
        select: {
          id: true,
          title: true,
          grade: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const uniqueStudents = new Set(results.map((r) => r.userId)).size;
  const completedCount = results.filter((r) => r.isCompleted).length;
  const totalAttempts = results.length;
  const averageScore =
    totalAttempts > 0
      ? Math.round(
          results.reduce((acc, r) => acc + (r.score ?? 0), 0) / totalAttempts
        )
      : 0;

  const passageSummary = Object.values(
    results.reduce((acc, result) => {
      const id = result.passageId;
      if (!acc[id]) {
        acc[id] = {
          id,
          title: result.passage.title,
          grade: result.passage.grade,
          attempts: 0,
          avgScore: 0,
        };
      }
      acc[id].attempts += 1;
      acc[id].avgScore += result.score ?? 0;
      return acc;
    }, {} as Record<string, { id: string; title: string; grade: string; attempts: number; avgScore: number }>)
  ).map((item) => ({
    ...item,
    avgScore: item.attempts > 0 ? Math.round(item.avgScore / item.attempts) : 0,
  }));

  const locationLabel = [
    user.province && `${user.province} viloyati`,
    user.region && `${user.region} tumani`,
    user.schoolName && user.schoolName,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <div className="container max-w-360 mx-auto px-4 py-12">
        <div className="space-y-3 mb-8">
          <p className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-100">
            <MapPin className="h-4 w-4" />
            {locationLabel || "Hudud ma'lumoti mavjud emas"}
          </p>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Natijalar
              </h1>
              <p className="text-gray-600">
                Shu hududdagi o‘quvchilarning urinishlari va ballari
              </p>
            </div>
            <Link
              href="/teacher/passages"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Matnlarga o‘tish
              <BookOpen className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-10">
          {[
            {
              icon: Users,
              label: "Jami o'quvchilar",
              value: uniqueStudents,
              color: "from-blue-500 to-blue-600",
            },
            {
              icon: BarChart3,
              label: "O‘rtacha ball",
              value: `${averageScore}%`,
              color: "from-purple-500 to-purple-600",
            },
            {
              icon: Award,
              label: "Yakunlangan testlar",
              value: completedCount,
              color: "from-green-500 to-green-600",
            },
            {
              icon: Target,
              label: "Jami urinishlar",
              value: totalAttempts,
              color: "from-orange-500 to-orange-600",
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition-all"
              >
                <div
                  className={`bg-linear-to-br ${stat.color} rounded-xl w-11 h-11 flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Matnlar bo‘yicha ko‘rinish
              </h2>
              <p className="text-sm text-muted-foreground">
                Qaysi matndan nechta urinish va o‘rtacha ball
              </p>
            </div>
          </div>

          {passageSummary.length ? (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
              {passageSummary.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {item.title}
                    </p>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {GRADE_LABELS[item.grade] || item.grade}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <span>Urinishlar: {item.attempts}</span>
                    <span>O‘rtacha: {item.avgScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-600">
              Hali natijalar yo‘q.
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                O‘quvchilar natijalari
              </h2>
              <p className="text-sm text-muted-foreground">
                Har bir urinish bo‘yicha batafsil ma’lumot
              </p>
            </div>
            <span className="text-sm text-gray-500">
              {totalAttempts} ta urinish
            </span>
          </div>

          {results.length ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      O‘quvchi
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Matn
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Ball
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Urinish
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
                  {results.map((result, index) => (
                    <tr
                      key={result.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index === results.length - 1 ? "border-b-0" : ""
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
                            {result.user.schoolName || "Maktab ko‘rsatilmagan"}
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
                              result.passage.grade.replace("GRADE_", "") +
                                "-sinf"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-bold text-gray-900">
                          {result.score ?? 0}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {result.attemptNumber}-urinish
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
                        {formatDate(result.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-10 text-center text-gray-600">
              Hozircha natijalar yo‘q. Avval o‘quvchilar matnlarni o‘qib test
              topshirishi kerak.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
