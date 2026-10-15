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

      {/* 3. Compact Header */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Apple SF Style Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-950/20 mb-3 backdrop-blur-md">
          <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Chronometer Resmi Festival</span>
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight uppercase mb-2">
          Hitung Mundur Menuju{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-sky-300">
            Perhelatan Akbar
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-2 font-normal leading-relaxed">
          Mahakarya seni rupa dan presisi industri menyambut pembukaan resmi PRIDE Industri 2026 di koridor historis Jalan Braga Bandung.
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

