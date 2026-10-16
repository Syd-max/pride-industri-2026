'use client';

import WatchCountdown from '@/components/ui/WatchCountdown';
import './watch-countdown.css';

export default function CountdownSection() {
  return (
    <section
      id="countdown"
      className="watch-countdown-section"
      aria-label="Hitung Mundur Waktu Menuju PRIDE Industri 2026"
    >
      {/* 1. Ambient Horizon Glow & Accent Line */}
      <div className="watch-top-glow" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 via-blue-500/50 to-transparent z-10" />

      {/* 2. Focused Radial Spotlight on Watch */}
      <div className="watch-stage-spotlight" />

      {/* 3. Header: Pure Apple Typography, Generous Clearance, Zero Clutter */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center mb-6 sm:mb-8">
        {/* Apple Keynote Style Minimal Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase text-slate-300 bg-white/[0.06] border border-white/10 backdrop-blur-md mb-4 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Festival Countdown · Braga 2026</span>
        </div>

        {/* Clean, Majestic Headline — Architectural Typography, No AI Rainbow Gradients */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight uppercase leading-tight mb-4">
          Menuju PRIDE Industri 2026
        </h2>

        {/* Authentic, Grounded Event Description */}
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto font-normal leading-relaxed">
          Menghitung hari menuju perhelatan akbar industri kreatif Kota Bandung: pameran produk binaan, malam penganugerahan SIINAS, dan runway fesyen di koridor Jalan Braga, 27–28 November 2026.
        </p>
      </div>

      {/* 4. The Tilted Haute Horlogerie Artistic Timepiece (Unclipped) */}
      <div className="relative z-10 max-w-3xl mx-auto px-2">
        <WatchCountdown />
      </div>

      {/* 5. Seamless Smooth Blend to White About Section */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-transparent via-[#04060b]/40 to-white pointer-events-none z-10" />
    </section>
  );
}

