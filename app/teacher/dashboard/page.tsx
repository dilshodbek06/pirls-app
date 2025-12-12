import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, TrendingUp, Award } from "lucide-react";
import PassageCard from "@/components/PassageCard";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function TeacherDashboard() {
  const session = await getSession();
  const user = session.user;

  if (!user || !user.isLoggedIn || user.role !== "TEACHER") {
    redirect("/auth/login");
  }

  const userLocationFilter = {
    ...(user.province ? { province: user.province } : {}),
    ...(user.region ? { region: user.region } : {}),
    ...(user.schoolName ? { schoolName: user.schoolName } : {}),
  };

  const [passages, passageCount, uniqueStudents, completedTests] =
    await Promise.all([
      prisma.passage.findMany({
        include: { questions: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.passage.count(),
      prisma.user.count({
        where: { role: "USER", ...userLocationFilter },
      }),
      prisma.result.count({
        where: {
          isCompleted: true,
          user: { role: "USER", ...userLocationFilter },
        },
      }),
    ]);

  const teacherName =
    user.fullName || user.email?.split("@")[0] || "O‘qituvchi";
  const provinceLabel = user.province
    ? `${user.province} viloyati`
    : "Viloyat ko‘rsatilmagan";
  const regionLabel = user.region
    ? `${user.region} tumani`
    : "Tuman ko‘rsatilmagan";
  const schoolLabel = user.schoolName || "Maktab ko‘rsatilmagan";

  const stats = [
    {
      icon: BookOpen,
      label: "Barcha matnlar",
      value: passageCount,
      href: "/teacher/passages",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: TrendingUp,
      label: "Jami o'quvchilar",
      value: uniqueStudents,
      href: "/teacher/results",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Award,
      label: "Bajarilgan testlar",
      value: completedTests,
      href: "/teacher/results",
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <div className="container max-w-360 mx-auto px-4 py-12 sm:py-16">
        <div className="space-y-4 mb-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Xush kelibsiz, <span className="text-blue-600">{teacherName}</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            O‘quvchilaringizning o‘qish ko‘nikmalarini rivojlantirish uchun
            PIRLS testlarini kuzatib boring.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2 text-sm">
            <p className="text-gray-900 font-semibold">{provinceLabel}</p>
            <p className="text-gray-900 font-semibold">{regionLabel}</p>
            <p className="text-gray-900 font-semibold">{schoolLabel}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link key={index} href={stat.href}>
                <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-blue-300 cursor-pointer h-full">
                  <div
                    className={`bg-linear-to-br ${stat.color} rounded-xl w-12 h-12 flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Oxirgi matnlar
            </h2>
            <Link
              href="/teacher/passages"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Hammasini ko‘rish →
            </Link>
          </div>

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
}
