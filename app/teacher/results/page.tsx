"use client";

import { BarChart3, TrendingUp, Users, Award } from "lucide-react";

export default function TeacherResults() {
  const resultsData = [
    {
      id: 1,
      title: "The Amazing Dolphins",
      attempts: 24,
      averageScore: 78,
      difficulty: "Easy",
      completionRate: 92,
    },
    {
      id: 2,
      title: "The Journey of a Raindrop",
      attempts: 18,
      averageScore: 72,
      difficulty: "Medium",
      completionRate: 85,
    },
    {
      id: 3,
      title: "Ancient Egyptian Pyramids",
      attempts: 12,
      averageScore: 65,
      difficulty: "Hard",
      completionRate: 70,
    },
    {
      id: 4,
      title: "The Life of Bees",
      attempts: 21,
      averageScore: 81,
      difficulty: "Easy",
      completionRate: 95,
    },
  ];

  const stats = [
    {
      icon: Users,
      label: "Jami o'quvchilar",
      value: 148,
      change: "+12",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: BarChart3,
      label: "O'rtacha ball",
      value: "74%",
      change: "+5%",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Award,
      label: "Tugatilgan testlar",
      value: 342,
      change: "+45",
      color: "from-green-500 to-green-600",
    },
    {
      icon: TrendingUp,
      label: "Yaxshi natija",
      value: "64%",
      change: "+3%",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <div className="container max-w-360 mx-auto px-4 py-12">
        {/* Header */}
        <div className="space-y-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Natijalar
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all"
              >
                <div
                  className={`bg-linear-to-br ${stat.color} rounded-xl w-12 h-12 flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  {stat.label}
                </p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <span className="text-green-600 text-sm font-medium">
                    {stat.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Test natijalar</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Test nomi
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Urinishlar
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    O‘rtacha ball
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Tugatish %
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Qiyinlik
                  </th>
                </tr>
              </thead>
              <tbody>
                {resultsData.map((result, index) => (
                  <tr
                    key={result.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      index === resultsData.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {result.title}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {result.attempts}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-green-500 to-green-600"
                            style={{
                              width: `${result.averageScore}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-10">
                          {result.averageScore}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-gray-900">
                        {result.completionRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          result.difficulty === "Easy"
                            ? "bg-green-100 text-green-700"
                            : result.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {result.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
