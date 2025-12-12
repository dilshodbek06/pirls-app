import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Award,
  BarChart3,
  BookOpen,
  Clock,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session";
import CertificateDownloadButton from "./CertificateDownloadButton";

export default async function PupilResults() {
  const session = await getSession();
  const user = session.user;

  if (!user || !user.isLoggedIn || user.role !== "USER") {
    redirect("/auth/login");
  }
  const studentName = user.fullName || user.email || "Foydalanuvchi";

  const results = await prisma.result.findMany({
    where: { userId: user.id },
    include: { passage: true },
    orderBy: { createdAt: "desc" },
  });

  const sertificateLength = results.filter((r) => r.score >= 80).length;

  const totalAttempts = results.length;
  const averageScore =
    totalAttempts > 0
      ? Math.round(
          results.reduce((acc, result) => acc + (result.score || 0), 0) /
            totalAttempts
        )
      : 0;
  const bestScore =
    totalAttempts > 0
      ? Math.max(...results.map((result) => result.score ?? 0))
      : 0;

  const milestones = [
    {
      label: "Yakunlangan testlar",
      value: totalAttempts.toString(),
      icon: Trophy,
    },
    { label: "O‘rtacha ball", value: `${averageScore}%`, icon: BarChart3 },
    { label: "Eng yuqori natija", value: `${bestScore}%`, icon: Target },
    { label: "Sertifikatlar", value: sertificateLength, icon: Award },
  ];

  const formatDate = (date: Date) =>
    date.toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/90 via-accent/70 to-secondary/80" />
        <div className="relative container max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-white">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium border border-white/25">
                <Sparkles className="h-4 w-4" />
                Sizning o‘qish yo‘lingiz
              </p>
              <h1 className="text-3xl md:text-4xl font-bold">Natijalar</h1>
              <p className="text-white/85 max-w-2xl">
                Oxirgi testlaringiz, o‘rtacha ball, va qo‘lga kiritilgan
                sertifikatlaringizni kuzatib boring. Yangi yutuqlar sari davom
                eting!
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-5 w-full md:w-80 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-yellow-200" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Joriy daraja</p>
                  <p className="text-lg font-semibold">O‘qish sifati</p>
                </div>
              </div>
              <div className="w-full bg-white/25 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white"
                  style={{ width: `${averageScore}%` }}
                  aria-label="Level progress 68%"
                />
              </div>
              <p className="text-xs text-white/70 mt-2">
                yuqori natijalar sari olg‘a
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-12 space-y-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {milestones.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-xl font-semibold text-gray-900">
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Oxirgi testlar
              </h2>
              <p className="text-sm text-muted-foreground">
                Oxirgi o‘qilgan matnlar va ballaringiz.
              </p>
            </div>
            <Link
              href="/passages"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
            >
              Matnlarga qaytish
              <BookOpen className="h-4 w-4" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {results.length === 0 ? (
              <div className="px-6 py-8 text-center text-muted-foreground">
                Hozircha natijalar yo‘q. Avval o‘qish matnidan test topshiring.
              </div>
            ) : (
              results.map((attempt, index) => (
                <div
                  key={attempt.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        {attempt.passage.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {attempt.attemptNumber}-urinish
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          {attempt.passage.grade.replace("_", "-")}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Target className="h-3.5 w-3.5" />
                          {attempt.isCompleted ? "Yakunlangan" : "Jarayonda"}
                        </span>
                        <span>{formatDate(attempt.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {attempt.score ?? 0}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Umumiy ball
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/passages/${attempt.passageId}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
                      >
                        Matnni ko‘rish
                      </Link>
                      <CertificateDownloadButton
                        passageTitle={attempt.passage.title}
                        studentName={studentName}
                        score={attempt.score ?? 0}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
