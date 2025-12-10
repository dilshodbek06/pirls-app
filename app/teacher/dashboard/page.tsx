"use client";

import { useUser } from "@/hooks/use-user";
import { passages } from "@/mock/passagesData";
import PassageCard from "@/components/PassageCard";
import { BookOpen, TrendingUp, Award } from "lucide-react";
import Link from "next/link";

export default function TeacherDashboard() {
  const { user } = useUser();

  const stats = [
    {
      icon: BookOpen,
      label: "Barcha matnlar",
      value: passages.length,
      href: "/teacher/passages",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: TrendingUp,
      label: "Jami o'quvchilar",
      value: 24,
      href: "/teacher/results",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Award,
      label: "Bajarilgan testlar",
      value: 156,
      href: "/teacher/results",
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="container max-w-360 mx-auto px-4 py-12 sm:py-16">
        <div className="space-y-4 mb-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Xush kelibsiz,{" "}
            <span className="text-blue-600">{user?.email.split("@")[0]}</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            O‘quvchilaringizning o‘qish ko‘nikmalarini rivojlantirish uchun
            PIRLS testlarini kuzatib boring.
          </p>
        </div>

        {/* Location Section */}
        {user && (
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mb-6">
            <div className="flex flex-wrap gap-2 text-sm">
              <div>
                <p className="text-gray-900 font-semibold">
                  {user.province + " viloyati" || "Buxoro viloyati"}
                </p>
              </div>
              <div>
                <p className="text-gray-900 font-semibold">
                  {user.region + " tumani" || "Kogon tumani"}
                </p>
              </div>
              <div>
                <p className="text-gray-900 font-semibold">
                  {user.schoolName || "45-maktab"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
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

        {/* Recent Passages Section */}
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

          {/* Passages Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {passages.slice(0, 3).map((passage) => (
              <PassageCard key={passage.id} passage={passage} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
