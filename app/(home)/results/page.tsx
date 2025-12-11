import Link from "next/link";
import {
  Award,
  BarChart3,
  BookOpen,
  Clock,
  Download,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

const attempts = [
  {
    id: "1",
    title: "The Amazing Dolphins",
    score: 88,
    timeSpent: "11:23",
    date: "12-yan, 2024",
    difficulty: "Oson",
    status: "Yakunlangan",
  },
  {
    id: "2",
    title: "Ancient Egyptian Pyramids",
    score: 76,
    timeSpent: "14:02",
    date: "05-yan, 2024",
    difficulty: "O‘rtacha",
    status: "Yakunlangan",
  },
  {
    id: "3",
    title: "Life of Bees",
    score: 92,
    timeSpent: "09:41",
    date: "28-dek, 2023",
    difficulty: "Oson",
    status: "Yakunlangan",
  },
];

const certificates = [
  {
    id: "c1",
    title: "Reading Master — Level 1",
    date: "15-dek, 2023",
    badge: "Gold",
  },
  {
    id: "c2",
    title: "Consistency Streak — 7 kun",
    date: "02-yan, 2024",
    badge: "Silver",
  },
];

const milestones = [
  { label: "Yakunlangan testlar", value: "24", icon: Trophy },
  { label: "O‘rtacha ball", value: "83%", icon: BarChart3 },
  { label: "Eng yuqori natija", value: "96%", icon: Target },
  { label: "Sertifikatlar", value: "3", icon: Award },
];

export default function PupilResults() {
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
              <h1 className="text-3xl md:text-4xl font-bold">
                Natijalar va yutuqlar
              </h1>
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
                  <p className="text-lg font-semibold">Reading Explorer</p>
                </div>
              </div>
              <div className="w-full bg-white/25 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white"
                  style={{ width: "68%" }}
                  aria-label="Level progress 68%"
                />
              </div>
              <p className="text-xs text-white/70 mt-2">
                32% qoldi keyingi darajaga
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
            {attempts.map((attempt, index) => (
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
                      {attempt.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {attempt.timeSpent}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {attempt.difficulty}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Target className="h-3.5 w-3.5" />
                        {attempt.status}
                      </span>
                      <span>{attempt.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {attempt.score}%
                    </p>
                    <p className="text-xs text-muted-foreground">Umumiy ball</p>
                  </div>
                  <Link
                    href="/passages"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
                  >
                    Natijani ko‘rish
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Sertifikatlar
              </h3>
              <p className="text-sm text-muted-foreground">
                Yakunlagan darajalar va mukofotlaringiz.
              </p>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">{cert.date}</p>
                    <p className="text-base font-semibold text-gray-900">
                      {cert.title}
                    </p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-white text-primary text-xs font-semibold mt-2 border border-primary/20">
                      {cert.badge} badge
                    </span>
                  </div>
                  <button className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
                    <Download className="h-4 w-4" />
                    Yuklab olish
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tavsiya</p>
                <p className="text-base font-semibold text-gray-900">
                  Navbatdagi matn
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-linear-to-br from-primary/10 via-white to-secondary/10 border border-dashed border-primary/20 p-4">
              <p className="text-sm text-muted-foreground mb-1">
                Sizning keyingi qadamingiz
              </p>
              <p className="text-lg font-semibold text-gray-900">
                “Journey of a Raindrop”
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                O‘rta murakkablik, tabiat mavzusi
              </p>
              <Link
                href="/passages"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 mt-3"
              >
                Boshlash
              </Link>
            </div>

            <div className="rounded-xl border border-gray-200 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  O‘qish odati
                </span>
                <span className="text-xs text-primary font-semibold">
                  7 kunlik streak
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: "70%" }}
                  aria-label="Streak progress 70%"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Yana 3 kun davom ettirsangiz, yangi badge ochiladi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
