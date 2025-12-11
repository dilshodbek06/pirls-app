import Image from "next/image";

const Loading = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-white">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg2.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-linear-to-br from-primary/85 via-accent/75 to-secondary/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.18),transparent_40%)]" />
      </div>

      <div className="relative z-10 h-screen flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-4xl  -mt-20 space-y-3 text-center">
          <div className="flex flex-col mx-auto w-fit items-center  rounded-2xl border border-white/15 bg-white/10 px-6 py-5 text-left shadow-xl backdrop-blur-md ">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
                <div className="h-8 w-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              </div>
            </div>
            <p className="text-base mt-2 sm:text-lg text-white/90">
              Sahifa ma&apos;lumotlari yuklanmoqda.
            </p>
            <p>Iltimos, bir necha soniya kuting.</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-white/70">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            <p>Yuklanish odatda bir necha soniya davom etadi.</p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.08),transparent_25%),radial-gradient(circle_at_90%_90%,rgba(255,255,255,0.1),transparent_30%)]" />
    </div>
  );
};

export default Loading;
