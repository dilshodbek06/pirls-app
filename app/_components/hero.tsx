import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/user-server";
import { BookOpen, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ROUTE_BY_ROLE: Record<string, string> = {
  TEACHER: "/teacher/dashboard",
  USER: "/passages",
  ADMIN: "/admin/dashboard", // agar kerak bo'lsa
  GUEST: "/auth/register",
};

const Hero = async () => {
  // getUser xatosiz chaqiriladi — xatoda guest holat qaytadi
  const { isLoggedIn, role } = await getUser().catch(() => ({
    isLoggedIn: false,
    role: "GUEST",
  }));

  console.log(role);

  // CTA manzili — ro'l bo'yicha xaritadan yoki defaultga tushadi
  const ctaHref =
    isLoggedIn && role && ROUTE_BY_ROLE[role]
      ? ROUTE_BY_ROLE[role]
      : isLoggedIn
      ? "/passages" // agar rol noma'lum bo'lsa, logged-in user uchun default
      : ROUTE_BY_ROLE["GUEST"];

  return (
    <div>
      <section className="relative min-h-screen flex flex-col px-4 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={"/images/hero-bg2.jpg"}
            alt="Children studying together"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
            priority={true}
          />
          <div className="absolute inset-0 bg-linear-to-br from-primary/85 via-accent/75 to-secondary/85" />
        </div>

        <Header />

        <div className="container mx-auto relative z-10 flex-1 flex items-center justify-center py-20">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/30">
              <Target className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">
                PIRLS Ta&apos;lim platformasi
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              PIRLS EDU bilan o‘qib tushunish mahoratini egallang
            </h1>

            <p className="text-lg md:text-xl text-white/95 mb-8 max-w-2xl mx-auto drop-shadow-md">
              O‘quvchilarning o‘qish ko‘nikmalarini rivojlantirish uchun
              mo‘ljallangan, qiziqarli matnlar va interaktiv savollar asosidagi
              zamonaviy ta’lim platformasi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ctaHref} aria-label="Boshlash">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90 shadow-lg"
                >
                  Boshlash
                  <BookOpen className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link href="/passages" aria-label="Matnlar ro'yxati">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 backdrop-blur-sm shadow-lg"
                >
                  Matnlar ro&apos;yxati
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
