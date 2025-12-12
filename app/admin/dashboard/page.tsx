import PassageCard from "@/components/PassageCard";
import { BookOpen, TrendingUp, Award } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TeacherDashboard() {
  const [
    passagesCount,
    teacherCount,
    studentCount,
    completedTestsCount,
    passages,
  ] = await Promise.all([
    prisma.passage.count(),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.result.count({ where: { isCompleted: true } }),
    prisma.passage.findMany({
      include: { questions: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const stats = [
    {
      icon: BookOpen,
      label: "Barcha matnlar",
      value: passagesCount,
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: TrendingUp,
      label: "Jami o'qituvchilar",
      value: teacherCount,
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Award,
      label: "Jami o'quvchilar",
      value: studentCount,
      color: "from-green-500 to-green-600",
    },
    {
      icon: Award,
      label: "Bajarilgan testlar",
      value: completedTestsCount,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="container max-w-360 mx-auto px-4 py-12 sm:py-16">
        <div className="space-y-4 mb-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Xush kelibsiz, Admin!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Maktablar o‘quvchilari PIRLS testlarini samarali bajarishlari uchun
            zarur bo‘lgan resurslar va vositalarni taqdim eting.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-blue-300  h-full"
              >
                <div
                  className={`bg-linear-to-br ${stat.color} rounded-xl w-12 h-12 flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Passages Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Oxirgi yaratilgan matnlar
            </h2>
            <Link
              href="/admin/passages"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Hammasini ko‘rish →
            </Link>
          </div>

          {/* Passages Grid */}
          {passages.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {passages.map((passage) => (
                <PassageCard key={passage.id} passage={passage} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-600">
              Hali matnlar qo&apos;shilmagan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
