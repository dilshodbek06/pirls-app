export default function Loading() {
  return (
    <div className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden px-4">
      {/* Ambient background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-tr from-primary/20 via-blue-500/15 to-purple-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Modern Card */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 max-w-sm w-full rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl backdrop-blur-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
        {/* Animated Brand Pulse & Spinner */}
        <div className="relative flex items-center justify-center w-20 h-20">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping opacity-40" />
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40 animate-[spin_8s_linear_infinite]" />
          <div className="w-14 h-14 rounded-full border-3 border-transparent border-t-primary border-r-blue-500 animate-spin" />
          <div className="w-8 h-8 rounded-full border-2 border-transparent border-b-purple-500 border-l-cyan-400 animate-[spin_1s_linear_infinite_reverse]" />
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
        </div>

        {/* Text & Status */}
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            Sahifa yuklanmoqda...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Iltimos, bir necha soniya kuting
          </p>
        </div>

        {/* Shimmer Progress Line */}
        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary to-transparent w-3/4 animate-marquee" />
        </div>
      </div>
    </div>
  );
}
