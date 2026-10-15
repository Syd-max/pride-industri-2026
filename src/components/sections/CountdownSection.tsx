'use client';

import Countdown from '@/components/ui/Countdown';

export default function CountdownSection() {
  return (
    <section
      id="countdown"
      className="relative w-full py-20 sm:py-28 bg-[#070a13] text-white overflow-hidden border-t border-rose-950/40"
      aria-label="Hitung Mundur Catwalk Runway PRIDE Industri 2026"
    >
      {/* 1. Full-Width Top Transition Glow (Seamlessly Closes Hero Section across 100% width) */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rose-500/60 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-32 bg-gradient-to-b from-rose-600/15 via-rose-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* 2. Overhead Fashion Show Spotlights (Sweeping Gently from Corners) */}
      <div className="absolute -top-36 left-4 sm:left-24 w-80 h-[560px] bg-gradient-to-b from-rose-500/20 via-amber-300/10 to-transparent blur-3xl pointer-events-none animate-spotlight-left" />
      <div className="absolute -top-36 right-4 sm:right-24 w-80 h-[560px] bg-gradient-to-b from-blue-500/20 via-rose-400/10 to-transparent blur-3xl pointer-events-none animate-spotlight-right" />

      {/* 3. Center Runway Perspective Track with Illuminated Floor Guides */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-4xl border-x-2 border-dashed border-rose-500/20 bg-gradient-to-b from-rose-500/5 via-slate-900/30 to-rose-500/5 pointer-events-none" />

      {/* 4. Running Catwalk Floor Lights (Left & Right Edge LED Indicators) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-[220px] sm:-translate-x-[420px] w-2 h-2 rounded-full bg-rose-500 animate-led-run pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-[220px] sm:-translate-x-[420px] w-2 h-2 rounded-full bg-amber-400 animate-led-run pointer-events-none" />
      <div className="absolute top-3/4 left-1/2 -translate-x-[220px] sm:-translate-x-[420px] w-2 h-2 rounded-full bg-blue-400 animate-led-run pointer-events-none" />

      <div className="absolute top-1/4 left-1/2 translate-x-[218px] sm:translate-x-[418px] w-2 h-2 rounded-full bg-rose-500 animate-led-run pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 translate-x-[218px] sm:translate-x-[418px] w-2 h-2 rounded-full bg-amber-400 animate-led-run pointer-events-none" />
      <div className="absolute top-3/4 left-1/2 translate-x-[218px] sm:translate-x-[418px] w-2 h-2 rounded-full bg-blue-400 animate-led-run pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Catwalk Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-rose-500/10 text-rose-300 border border-rose-500/30 shadow-lg shadow-rose-950/40 mb-4 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span>Catwalk Fashion Runway 2026</span>
        </div>

        {/* Fashion Editorial Headline */}
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase mb-3">
          Hitung Mundur <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400 font-extrabold">Menuju Runway</span>
        </h2>
        
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
          Persiapkan diri Anda menyaksikan peragaan busana ready-to-wear desainer binaan Disdagin Kota Bandung, pameran produk IKM, dan kemeriahan panggung koridor Braga.
        </p>
        
        {/* The 4 Elevated Runway Podiums */}
        <div className="relative max-w-4xl mx-auto">
          <Countdown />
        </div>
      </div>

      {/* 5. Animated Catwalk Fashion Show Marquee Ribbon at Bottom */}
      <div className="relative z-10 mt-14 py-3.5 border-y border-white/10 bg-slate-900/60 backdrop-blur-md overflow-hidden">
        <div className="animate-catwalk-marquee text-xs font-extrabold uppercase tracking-widest text-slate-300">
          <span className="inline-flex items-center gap-4 mx-6">
            <span className="text-rose-400">◆</span>
            <span>Runway Fashion Show Braga City Walk</span>
            <span className="text-amber-400">◆</span>
            <span>50+ Koleksi Desainer Binaan Kota Bandung</span>
            <span className="text-blue-400">◆</span>
            <span>Ready-to-Wear Kreatif &amp; Fesyen Kurasi</span>
            <span className="text-emerald-400">◆</span>
            <span>Malam Penganugerahan SIINAS Hotel Papandayan</span>
            <span className="text-rose-400">◆</span>
            <span>27–28 November 2026</span>
          </span>
          <span className="inline-flex items-center gap-4 mx-6" aria-hidden="true">
            <span className="text-rose-400">◆</span>
            <span>Runway Fashion Show Braga City Walk</span>
            <span className="text-amber-400">◆</span>
            <span>50+ Koleksi Desainer Binaan Kota Bandung</span>
            <span className="text-blue-400">◆</span>
            <span>Ready-to-Wear Kreatif &amp; Fesyen Kurasi</span>
            <span className="text-emerald-400">◆</span>
            <span>Malam Penganugerahan SIINAS Hotel Papandayan</span>
            <span className="text-rose-400">◆</span>
            <span>27–28 November 2026</span>
          </span>
        </div>
      </div>

      {/* 6. Bottom Smooth Blend into White AboutSection */}
      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-b from-transparent to-white pointer-events-none" />
    </section>
  );
}
