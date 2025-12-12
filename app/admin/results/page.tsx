import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Award,
  BarChart3,
  BookOpen,
  Globe2,
  GraduationCap,
  Target,
  Users,
} from "lucide-react";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session";
import ResultTableClient from "./ResultTableClient";

export const dynamic = "force-dynamic";

export default async function AdminResultsPage() {
  const session = await getSession();
  const user = session.user;

  if (!user || !user.isLoggedIn || user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  const results = await prisma.result.findMany({
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
          teacher: {
            select: { id: true, fullName: true, email: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalAttempts = results.length;
  const completedCount = results.filter((r) => r.isCompleted).length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(
          results.reduce((sum, r) => sum + (r.score ?? 0), 0) / totalAttempts
        )
      : 0;
  const uniqueStudents = new Set(results.map((r) => r.userId)).size;
  const uniqueTeachers = new Set(
    results.map((r) => r.passage.teacher?.id).filter(Boolean)
  ).size;

  const provinceSummary = Object.values(
    results.reduce((acc, r) => {
      const key = r.user.province || "Noma’lum viloyat";
      if (!acc[key]) {
        acc[key] = { province: key, attempts: 0, completed: 0, avgScore: 0 };
      }
      acc[key].attempts += 1;
      acc[key].completed += r.isCompleted ? 1 : 0;
      acc[key].avgScore += r.score ?? 0;
      return acc;
    }, {} as Record<string, { province: string; attempts: number; completed: number; avgScore: number }>)
  ).map((item) => ({
    ...item,
    avgScore: item.attempts > 0 ? Math.round(item.avgScore / item.attempts) : 0,
  }));

  const teacherSummary = Object.values(
    results.reduce((acc, r) => {
      const key =
        r.passage.teacher?.id ||
        `unknown-${r.passage.teacher?.email || r.passage.teacher?.fullName}`;
      const name =
        r.passage.teacher?.fullName ||
        r.passage.teacher?.email ||
        "Noma’lum o‘qituvchi";
      if (!acc[key]) {
        acc[key] = { name, attempts: 0, avgScore: 0 };
      }
      acc[key].attempts += 1;
      acc[key].avgScore += r.score ?? 0;
      return acc;
    }, {} as Record<string, { name: string; attempts: number; avgScore: number }>)
  ).map((item) => ({
    ...item,
    avgScore: item.attempts ? Math.round(item.avgScore / item.attempts) : 0,
  }));

  const resultsForClient = results.map((result) => ({
    id: result.id,
    score: result.score ?? 0,
    isCompleted: result.isCompleted,
    attemptNumber: result.attemptNumber,
    createdAt: result.createdAt.toISOString(),
    user: {
      fullName: result.user.fullName,
      email: result.user.email,
      province: result.user.province,
      region: result.user.region,
      schoolName: result.user.schoolName,
    },
    passage: {
      title: result.passage.title,
      grade: result.passage.grade,
      teacherName:
        result.passage.teacher?.fullName ||
        result.passage.teacher?.email ||
        "Noma’lum o‘qituvchi",
    },
  }));

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <div className="container max-w-360 mx-auto px-4 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Admin natijalari
            </h1>
            <p className="text-gray-600">
              Butun tizim bo‘yicha urinishlar, o‘qituvchilar va o‘quvchilar
              natijalari
            </p>
          </div>
          <Link
            href="/admin/passages"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Matnlarni boshqarish
            <BookOpen className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-10">
          {[
            {
              icon: Users,
              label: "Jami o‘quvchilar",
              value: uniqueStudents,
              color: "from-blue-500 to-blue-600",
            },
            {
              icon: GraduationCap,
              label: "Faol o‘qituvchilar",
              value: uniqueTeachers,
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
              label: "O‘rtacha ball",
              value: `${avgScore}%`,
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

        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Viloyatlar kesimida
                </h2>
                <p className="text-sm text-muted-foreground">
                  Har bir viloyat bo‘yicha urinishlar va o‘rtacha ball
                </p>
              </div>
              <Globe2 className="h-5 w-5 text-gray-500" />
            </div>
            {provinceSummary.length ? (
              <div className="space-y-3">
                {provinceSummary.map((item) => (
                  <div
                    key={item.province}
                    className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 hover:border-blue-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-semibold">
                        {item.province.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.province}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.completed} yakunlangan • {item.attempts} urinish
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {item.avgScore}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        O‘rtacha ball
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600 py-6 border border-dashed border-gray-200 rounded-xl">
                Hali natijalar yo‘q.
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  O‘qituvchilar faoliyati
                </h2>
                <p className="text-sm text-muted-foreground">
                  Har bir o‘qituvchiga tegishli urinishlar
                </p>
              </div>
              <BarChart3 className="h-5 w-5 text-gray-500" />
            </div>
            {teacherSummary.length ? (
              <div className="space-y-3">
                {teacherSummary.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 hover:border-blue-200 transition-all"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.attempts} urinish
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {item.avgScore}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        O‘rtacha ball
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600 py-6 border border-dashed border-gray-200 rounded-xl">
                Hali o‘qituvchilar faoliyati yo‘q.
              </div>
            )}
          </div>
        </div>

        <ResultTableClient
          results={resultsForClient}
          totalAttempts={totalAttempts}
        />
      </div>
    </div>
  );
}
